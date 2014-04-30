import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class TreeViewHistory extends HttpServlet
{
    protected static TreeViewNode[] treeView=new TreeViewNode[]{
    	new TreeViewNode("root","Chaos",            "./assets/images/nodes/p.png",false,false,null),
    	
    	new TreeViewNode("ifs", "IFS",             "./assets/images/nodes/p.png",false,false,"root"),
    	new TreeViewNode("ds",  "Dreamsilk",        "./assets/images/chaos/ifs/dreamsilk.jpg",true,false,"ifs"),
    	new TreeViewNode("lf",  "Leaf",             "./assets/images/chaos/ifs/leaf.jpg",true,false,"ifs"),
    	new TreeViewNode("sp",  "Spirochete",       "./assets/images/chaos/ifs/spirochete.jpg",true,false,"ifs"),
    	new TreeViewNode("tr",  "Trilobite",        "./assets/images/chaos/ifs/trilobite.jpg",true,false,"ifs"),
    	
    	new TreeViewNode("ls",  "L-System",         "./assets/images/nodes/p.png",false,false,"root"),
    	new TreeViewNode("bush","Bush",             "./assets/images/chaos/ls/bush.jpg",true,false,"ls"),
    	new TreeViewNode("weed","Weed",             "./assets/images/chaos/ls/weed.jpg",true,false,"ls"),

    	new TreeViewNode("sa",  "Strange Attractor","./assets/images/nodes/p.png",false,false,"root"),

    	new TreeViewNode("sa2d","2D",               "./assets/images/nodes/p.png",false,false,"sa"),
    	new TreeViewNode("dj",  "deJong",           "./assets/images/chaos/sa/sa2d/deJong.jpg",true,false,"sa2d"),
    	new TreeViewNode("lor", "Lorenz",           "./assets/images/chaos/sa/sa2d/lorenzII.jpg",true,false,"sa2d"),
    	new TreeViewNode("q1",  "Poly I",           "./assets/images/chaos/sa/sa2d/quad.jpg",true,false,"sa2d"),
    	new TreeViewNode("q2",  "Poly II",          "./assets/images/chaos/sa/sa2d/quad2.jpg",true,false,"sa2d"),

    	new TreeViewNode("sa3d","3D",               "./assets/images/nodes/p.png",false,false,"sa"),
    	new TreeViewNode("p1",  "Poly I",           "./assets/images/chaos/sa/sa3d/KRTYCFPFLTLSMOKRPEKMGPQHMUQYGY_240.gif",true,false,"sa3d"),
    	new TreeViewNode("p2",  "Poly II",          "./assets/images/chaos/sa/sa3d/MMDWQSXMGKLLEFJOCOIQGWKTGGOSRW_240.gif",true,false,"sa3d")
    };
    
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException
    {
        Map bookmarks=getBookmarks(req.getSession());
        
        String treeViewState=req.getParameter("treeViewState");
        String imageState   =req.getParameter("imageState");
        String bookmarkId   =req.getParameter("bookmarkId");
 
        // Add new bookmark
        if(treeViewState != null && bookmarkId != null)
        {
            String[] stateValues=treeViewState.split(",");
            List     states =new ArrayList();
            
            for(int i=0;i<stateValues.length;i+=2)
            {
                states.add(
                    new Object[]{stateValues[i],Boolean.valueOf(stateValues[i+1])}
                );
            }  
            
            bookmarks.put(bookmarkId,new StateModel(states,imageState));
        }
        // Get existing bookmark 
        else if(bookmarkId != null)
        {
            StateModel model=(StateModel) bookmarks.get(bookmarkId);
    
            res.setContentType("text/plain");
            
            for(Iterator i=model.state.iterator();i.hasNext();)
            {
                Object[] state=(Object[]) i.next();
                
                res.getWriter().write(
                        "getTreeView('imageBrowser').getNode('"+
                        ((String) state[0])+"').setExpanded("+
                        ((Boolean)state[1]).booleanValue()+");"
                    );
            }
            
            res.getWriter().write("getTreeView('imageBrowser').render();");
            res.getWriter().write("showImage('"+model.curImage+"')");
        }
        // Get initial state
        else
        {
            res.setContentType("text/plain");
            res.getWriter().write(getInitJavaScript());
            res.getWriter().write("showImage('No Image Loaded');");
        }
    }
    
    private Map getBookmarks(HttpSession session)
    {
        if(session.getAttribute("tv_bookmarks") == null)
        {
            session.setAttribute("tv_bookmarks",new HashMap());
        }
        
        return((Map) session.getAttribute("tv_bookmarks"));
    }
    
    private String getInitJavaScript()
    {
	    StringBuffer js=new StringBuffer();
	    
	    js.append("new TreeView('imageBrowser');");
	    js.append("getTreeView('imageBrowser').registerActionHandler(new HistoryImageActionHandler());");
	    js.append("getTreeView('imageBrowser').registerExpandContractHandler(HistoryExpandContractHandler);");

        for(int i=0;i<treeView.length;i++)
        {
            js.append(treeView[i].getInitJavaScript());
        }
        
        js.append("getTreeView('imageBrowser').render();");
        
	    return(js.toString());
    }
        
        
    public static class StateModel
    {
        public List   state;
        public String curImage;
        
        public StateModel(List state, String curImage)
        {
            this.state   =state;
            this.curImage=curImage;
        }
    }
    
    public static class TreeViewNode
    {
    	public String  id;
    	public String  text;
    	public String  icon;
    	public boolean action;
    	public boolean expanded;
    	public String  parentId;
    	
    	public TreeViewNode(
    	        String id,
    	        String text,
    	        String icon,
    	        boolean action,
    	        boolean expanded,
    	        String parentId)
    	{
    	    this.id      =id;
    	    this.text    =text;
    	    this.icon    =icon;
    	    this.action  =action;
    	    this.expanded=expanded;
    	    this.parentId=parentId;
    	}
    	
    	public String getInitJavaScript()
    	{
    	    StringBuffer js=new StringBuffer();
    	    
    	    js.append("getTreeView('imageBrowser').addNode(new TreeViewNode(");
    	    
    	    js.append("'"+id+"',");
    	    js.append("'"+text+"',");
    	    js.append("'"+icon+"',");
    	    js.append(action+",");
    	    
    	    js.append(""+expanded+",");
    	    js.append(((parentId == null)?("null"):("'"+parentId+"'")));
    	    
    	    js.append("));");
    	    
    	    return(js.toString());
    	}
    }
}
