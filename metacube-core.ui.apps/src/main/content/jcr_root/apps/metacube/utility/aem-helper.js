use(function () {


   var subPageNameValue, pageNameValue;
   var siteNameValue = currentPage.getAbsoluteParent(1).getName();
   
   if(siteNameValue == 'dog'){
	   siteNameValue = currentPage.getAbsoluteParent(1).getName() + "/" + currentPage.getAbsoluteParent(2).getName();
   }

   if(currentPage.getAbsoluteParent(2)!= undefined ){
       pageNameValue = siteNameValue + "__" + currentPage.getAbsoluteParent(2).getName();

        if(currentPage.getAbsoluteParent(3)!= undefined ){
        subPageNameValue = pageNameValue + "__" + currentPage.getAbsoluteParent(3).getName();
   }

   }


   return {
       siteName: siteNameValue,
       pageName: pageNameValue,
       subPageName : subPageNameValue

   };
});
