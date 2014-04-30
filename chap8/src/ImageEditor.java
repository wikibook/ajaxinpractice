import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.awt.image.BufferedImageOp;
import java.awt.image.ConvolveOp;
import java.awt.image.Kernel;
import java.awt.image.LookupOp;
import java.awt.image.ShortLookupTable;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.SingleThreadModel;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONObject;

public class ImageEditor extends HttpServlet implements SingleThreadModel
{
    public static Map renderingHints=new HashMap();
    
    // image operations for convolve and
    // palette lookups
    public static BufferedImageOp invertOp;
    public static BufferedImageOp posterizeOp;
    public static BufferedImageOp blurOp;
    public static BufferedImageOp edgeOp;
    public static BufferedImageOp sharpenOp;
    
    // Contants for image operations
    public static final int NO_OP      = 0; // No operation
    public static final int INVERT_OP  = 1; // invert colors
    public static final int POSTER_OP  = 2; // posterize
    public static final int BLUR_OP    = 3; // 3x3 blur
    public static final int EDGE_OP    = 4; // edge detect
    public static final int SHARPEN_OP = 5; // sharpen
    public static final int FLIP_H_OP  = 6; // horizontal flip
    public static final int FLIP_V_OP  = 7; // vertical flip
    public static final int ROTATE_OP  = 8; // rotate (in degrees)
    public static final int STRING_OP  = 9; // add text
    public static final int CONVOLVE_OP=10; // 3x3 custom convole
    
    // Image to edit
    public String fileHandle=null;
    
    HttpServletRequest req;
    HttpServletResponse res;
    
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
    {
        this.req=req;
        this.res=res;
        
        // instruct browser to not cache content
        this.res.setDateHeader("Expires",System.currentTimeMillis()-1000);
        this.res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
        this.res.addHeader("Cache-Control", "post-check=0, pre-check=0");
        this.res.setHeader("Pragma", "no-cache");
        
        // setup start point in stack.
        // load image, create first stack entry
        if("yes".equals(getParameter("init")))
        {
        	this.fileHandle=(String)(req.getParameter("src"));
        	initStack();
            getHistoryEntry(getIdx());
        }
        // get full sized image
        // at current index, or specify
        // another index
        else if("full".equals(getParameter("image")))
        {
            int idx=getIdx();
            try{idx=Integer.parseInt((String) getParameter("idx"));}catch(Exception e){;}
            
            getImage(idx,false);
        }
        // get thumbnail image (48x48)
        // at current index, or specify
        // another index
        else if("thumbnail".equals(getParameter("image")))
        {
            int idx=getIdx();
            try{idx=Integer.parseInt((String) getParameter("idx"));}catch(Exception e){;}
            
            getImage(idx,true);
        }
        // add action to stack
        else if(getParameter("action") != null)
        {
            addAction(
                Integer.parseInt((String) getParameter("action")),
                (String) getParameter("params")
            );
        }
        // seek to specified index
        else if(getParameter("seek") != null)
        {
            setIdx(Integer.parseInt((String) getParameter("seek")));
            res.getWriter().write(
                "ImageEditor?timestamp="+
                System.currentTimeMillis()+
                "&image=full&idx="+getIdx()
            );
        }
    }
    
    private void getHistoryEntry(int idx) throws IOException
    {
        PrintWriter p     =res.getWriter();

        // editing image src
        p.write("ImageEditor?image=full&timestamp="+System.currentTimeMillis());
        p.write("<!-- BREAK -->");
        
        // new row properties as JSON text
        p.write(getRowProperties(idx));
        p.write("<!-- BREAK -->");
        
        // registered new row event handlers (for eval)
        p.write("Event.observe('action_"+idx+"','mouseover',historyPaletteMouseOver);");
        p.write("Event.observe('action_"+idx+"','mouseout', historyPaletteMouseOut);");
        p.write("Event.observe('action_"+idx+"','mousedown',historyPaletteMouseDown);");
        p.write("Event.observe('action_"+idx+"','click',    historyPaletteMouseClick);");
    }
    
    private String getRowProperties(int idx)
    {
        String rowPropertiesString="";
        
        try
        {
	        UndoAction  action=(UndoAction) getStack().get(idx);
	        JSONObject rowProperties=new JSONObject();
	        
	        rowProperties.put("id","action_"+idx);
	        
	        rowProperties.put("paletteImageClass","paletteImage");
	        rowProperties.put("paletteImageHTML", "<IMG SRC='ImageEditor?timestamp="+System.currentTimeMillis()+"&image=thumbnail&idx="+idx+"' WIDTH='48' HEIGHT='48'>");
	        
	        rowProperties.put("paletteContentClass","paletteContent");
	        rowProperties.put("paletteContentHTML",
	            "<TABLE>"+
	              "<TR>"+
	                "<TD CLASS='paletteLabel'>Type:</TD>"+
	                "<TD CLASS='paletteText'>"+opToString(action.op)+"</TD>"+
	              "</TR>"+
	              "<TR>"+
	                "<TD CLASS='paletteLabel'>Params:</TD>"+
	                "<TD CLASS='paletteText'>"+paramsToString(action.op,action.params)+"</TD>"+
	              "</TR>"+
	            "</TABLE>"
	        );
	        
	        rowPropertiesString=rowProperties.toString();
        }
        catch(Exception e)
        {
            e.printStackTrace();
        }
        
        return(rowPropertiesString);
    }

    private static String paramsToString(int op, Object params)
    {
        switch(op)
        {
            case ROTATE_OP:
            {
                return(params.toString()+"&deg;");
            }
            case STRING_OP:
            {
                StringBuffer pString=new StringBuffer();
                String       color=Integer.toHexString(((Color) ((Object[]) params)[1]).getRGB());

                pString.append("Text: ");
                pString.append((String) ((Object[]) params)[0]);
                pString.append("<BR>Color: ");
                pString.append(color.substring(2,color.length()));
                pString.append("<BR>X: ");
                pString.append(((Integer) ((Object[]) params)[2]).intValue());
                pString.append(", Y: ");
                pString.append(((Integer) ((Object[]) params)[3]).intValue());
                
                return(pString.toString());
            }
            case CONVOLVE_OP:
            {
                DecimalFormat df=new DecimalFormat("0.00");
                StringBuffer pString=new StringBuffer();
                float[] ops =(float[]) params;
                int     line=(int) Math.sqrt(ops.length);
                
                for(int i=0;i<ops.length;i++)
                {
                    String curOp=df.format(ops[i]);
                    
                    if(curOp.length() == 4)
                    {
                        pString.append("&nbsp;");
                    }
                    
                    pString.append(curOp);
                    
                    if(i < ops.length-1)
                    {
                        pString.append(",");
                    }
                    
                    if((((i+1)%line) == 0) && i != 0)
                    {
                        pString.append("<BR>");
                    }
                }

                return(pString.toString());
            }
            case INVERT_OP:
            case POSTER_OP:
            case BLUR_OP:
            case EDGE_OP:
            case SHARPEN_OP:
            case FLIP_H_OP:
            case FLIP_V_OP:
            case NO_OP:
            default:         {return("None");}
        }
    }
    
    private static String opToString(int op)
    {
        switch(op)
        {
            case INVERT_OP:  {return("Invert");}
            case POSTER_OP:  {return("Posterize");}
            case BLUR_OP:    {return("Blur");}
            case EDGE_OP:    {return("Edge Detect");}
            case SHARPEN_OP: {return("Sharpen");}
            case FLIP_H_OP:  {return("Flip Horizontal");}
            case FLIP_V_OP:  {return("Flip Vertical");}
            case ROTATE_OP:  {return("Rotate");}
            case STRING_OP:  {return("String");}
            case CONVOLVE_OP:{return("Convolve");}
            case NO_OP:
            default:        {return("No Op");}
        }
    }
    
    private void getImage(int idx, boolean thumbnail) throws IOException
    {
        UndoAction action=(UndoAction) getStack().get(idx);
        
        res.setContentType("image/png");
        ImageIO.write(applyAction(action, thumbnail),"png",res.getOutputStream());
    }

    private BufferedImage applyAction(UndoAction action, boolean thumbnail)
    {
        BufferedImage tempImage=new BufferedImage(
                action.before.getWidth(),
                action.before.getHeight(),
                action.before.getType()
        );
        
        Graphics2D g2d=tempImage.createGraphics();
        g2d.addRenderingHints(renderingHints);
        
        switch(action.op)
        {
            case INVERT_OP:
            {
                invertOp.filter(action.before,tempImage);
                break;
            }
            case POSTER_OP:
            {
                posterizeOp.filter(action.before,tempImage);
                break;
            }
            case BLUR_OP:
            {
                blurOp.filter(action.before,tempImage);
                break;
            }
            case EDGE_OP:
            {
                edgeOp.filter(action.before,tempImage);
                break;
            }
            case SHARPEN_OP:
            {
                sharpenOp.filter(action.before,tempImage);
                break;
            }
            case FLIP_H_OP:
            {
                g2d.scale(-1,1);
                g2d.translate(-action.before.getWidth(),0);
                g2d.drawImage(
    	            action.before,
    	            0,0,action.before.getWidth(),action.before.getHeight(),
    	            null
    	        );
                break;
            }
            case FLIP_V_OP:
            {
                g2d.scale(1,-1);
                g2d.translate(0,-action.before.getHeight());
	            g2d.drawImage(
    	            action.before,
    	            0,0,action.before.getWidth(),action.before.getHeight(),
    	            null
    	        );
                break;
            }
            case ROTATE_OP:
            {
                g2d.rotate(
                    Math.toRadians(((Integer) action.params).intValue()),
                    action.before.getWidth()/2,
                    action.before.getHeight()/2
                );
                g2d.drawImage(
    	            action.before,
    	            0,0,action.before.getWidth(),action.before.getHeight(),
    	            null
    	        );
                break;
            }
            case STRING_OP:
            {
                g2d.drawImage(
    	            action.before,
    	            0,0,action.before.getWidth(),action.before.getHeight(),
    	            null
    	        );
                g2d.setColor((Color) ((Object[]) action.params)[1]);
                g2d.drawString(
                    (String) ((Object[]) action.params)[0],
                    ((Integer) ((Object[]) action.params)[2]).intValue(),
                    ((Integer) ((Object[]) action.params)[3]).intValue()
                );
                break;
            }
            case CONVOLVE_OP:
            {
                new ConvolveOp(
                        new Kernel(
                                3, 3, (float[]) action.params
                        )
                ).filter(action.before,tempImage);
                break;
            }
            default:
            case NO_OP:
            {
                g2d.drawImage(
    	            action.before,
    	            0,0,action.before.getWidth(),action.before.getHeight(),
    	            null
    	        );
            }
        }
        
        BufferedImage xformedImage=new BufferedImage(
                ((thumbnail)?(48):(action.before.getWidth())),
                ((thumbnail)?(48):(action.before.getHeight())),
                action.before.getType()
        );

        g2d=xformedImage.createGraphics();
        g2d.addRenderingHints(renderingHints);
        g2d.drawImage(
            tempImage,
            0,0,xformedImage.getWidth(),xformedImage.getHeight(),
            0,0,tempImage.getWidth(),   tempImage.getHeight(),
            null
        );
        
        return xformedImage;
    }

    private void addAction(int op, String paramString) throws IOException
    {
        //System.out.println(op+" "+paramString);
        
        if(op > 0 && op < 11)
        {
	        List stack=getStack();
	        int idx   =getIdx();

	        while(idx < stack.size()-1)
	        {
	            stack.remove(stack.size()-1);
	        }

	        
	        Object params=null;
	        
	        switch(op)
	        {
	            case INVERT_OP:{break;}
	            case POSTER_OP:{break;}
	            case BLUR_OP:{break;}
	            case EDGE_OP:{break;}
	            case SHARPEN_OP:{break;}
	            case FLIP_H_OP:{break;}
	            case FLIP_V_OP:{break;}
	            case ROTATE_OP:
	            {
	                params=new Integer(Integer.parseInt(paramString));
	                break;
	            }
	            case STRING_OP:
	            {
	                String[] paramPieces=paramString.split(",");
	                
	                params=new Object[]{
                        paramPieces[0].replaceAll("%%",","),
                        getColor(paramPieces[1]),
                        new Integer(Integer.parseInt(paramPieces[2])),
                        new Integer(Integer.parseInt(paramPieces[3]))
	                };
	                break;
	            }
	            case CONVOLVE_OP:
	            {
	                String[] paramPieces=paramString.split(",");
	                
	                params=new float[paramPieces.length];
	                
	                for(int i=0;i<paramPieces.length;i++)
	                {
	                    ((float[]) params)[i]=Float.parseFloat(paramPieces[i]);
	                }
	                
	                break;
	            }
	        }
	        
	        stack.add(
	            new UndoAction(
	                applyAction((UndoAction) stack.get(idx), false),
	                op,
	                params
	            )
	        );
	        
	        setIdx(++idx);
        }
        
        getHistoryEntry(getIdx());
    }

    private void initStack() throws IOException, MalformedURLException
    {
        List stack=new ArrayList();
        stack.add(
            new UndoAction(
                ImageIO.read(new URL(fileHandle).openConnection().getInputStream()),
                NO_OP,
                null
            )
        );
        
        setStack(stack);
        setIdx(0);
    }

    private Color getColor(String color)
    {
        return new Color(
            Integer.parseInt(color.substring(0,2),16),
            Integer.parseInt(color.substring(2,4),16),
            Integer.parseInt(color.substring(4,6),16)
        );
    }
    
    private void setStack(List stack)
    {
        getSession().setAttribute("UNDO_STACK",stack);
    }
    
    private void setIdx(int idx)
    {
        getSession().setAttribute("UNDO_STACK_IDX",new Integer(idx));
    }
    
    private List getStack()
    {
        return((List) getSession().getAttribute("UNDO_STACK"));
    }
    
    private int getIdx()
    {
        return(((Integer) getSession().getAttribute("UNDO_STACK_IDX")).intValue());
    }
    
    private HttpSession getSession()
    {
        return(req.getSession(true));
    }
    
    private Object getParameter(String name)
    {
        return(req.getParameter(name));
    }
    
    public static class UndoAction
    {
        public BufferedImage before;
        public int op;
        public Object params;
        
        public UndoAction(BufferedImage before, int op, Object params)
        {
            this.before=new BufferedImage(before.getWidth(),before.getHeight(),before.getType());
            this.before.getGraphics().drawImage(before,0,0,before.getWidth(),before.getHeight(),null);
            
            this.op    =op;
            this.params=params;
        }
    }
    
    // initialize rendering hints and static buffered image operations
    static
    {
        renderingHints.put(
                RenderingHints.KEY_INTERPOLATION,
                RenderingHints.VALUE_INTERPOLATION_BICUBIC
        );
        
        renderingHints.put(
                RenderingHints.KEY_TEXT_ANTIALIASING,
                RenderingHints.VALUE_TEXT_ANTIALIAS_ON
        );
        
        short[] invert = new short[256];
        
        for (int i = 0; i < 256; i++)
        {
            invert[i] = (short)(255 - i);
        }
        
        invertOp = new LookupOp(new ShortLookupTable(0, invert), null);

        short[] posterize = new short[256];
        
        for (int i = 0; i < 256; i++)
        {
            posterize[i] = (short)(i - (i % 32));
        }
        
        posterizeOp = new LookupOp(new ShortLookupTable(0, posterize), null);
        
        float ninth = 1.0f / 9.0f;
        float[] blur = new float[]{
	        ninth, ninth, ninth,
	        ninth, ninth, ninth,
	        ninth, ninth, ninth
        };
        blurOp = new ConvolveOp(new Kernel(3, 3, blur));

        float[] edge = new float[]{
	         0.0f, -1.0f, 0.0f,
	         -1.0f, 4.0f, -1.0f,
	         0.0f, -1.0f, 0.0f
        };
        edgeOp = new ConvolveOp(new Kernel(3, 3, edge));
      
        float[] sharpen = new float[]{
            0.0f, -1.0f, 0.0f,
            -1.0f, 5.0f, -1.0f,
            0.0f, -1.0f, 0.0f
        };
        sharpenOp = new ConvolveOp(
            new Kernel(3, 3, sharpen),
            ConvolveOp.EDGE_NO_OP, null
        );
    }
}