<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="xml"/>

 <xsl:template match="/person">
  <div>
  <h5><xsl:value-of select='@initial'/>'s favourite recipe is <xsl:value-of select='recipe/name'/></h5>
  <p><xsl:apply-templates select="recipe/ingredient" /></p>
  <p><i><xsl:value-of select='recipe/serving-suggestion'/></i></p>
  </div>
 </xsl:template>

 <xsl:template match="ingredient">
  <xsl:value-of select='@qty'/> : <xsl:value-of select='.'/><br/>
 </xsl:template>

</xsl:stylesheet>