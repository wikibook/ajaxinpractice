<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<c:choose>
  <c:when test="${param.color =='azure'}">
    ['Small','Medium','XXXL']
  </c:when>
  <c:when test="${param.color =='cardinal'}">
    ['Medium','Large','XL']
  </c:when>
  <c:when test="${param.color =='ecru'}">
    ['Small','Medium','Large','XL','XXL','XXXL']
  </c:when>
  <c:when test="${param.color =='hunter'}">
    ['Small','Medium','Large','XL','XXL']
  </c:when>
</c:choose>
