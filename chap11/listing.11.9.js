var CustomerManager = Class.create();

CustomerManager.prototype =
{
	customerData : new Array(),

	drawCustomerDIV : function(start, pageSize, div, cached)
	{
		if(div == null)
		{
			return;
		}
		
		displayString = "<ul>";
		
		for(i = start; i < pageSize + start && i < this.customerData.length; i++)
		{
			customer = this.customerData[i];
			
			displayString += '<li>';
			
			displayString += customer.customerID;
			if(cached)
			{
				displayString += " (cached) ";
			}
			displayString += " -- ";
			displayString += customer.firstName;
			displayString += " ";
			displayString += customer.lastName;
			
			displayString += '</li>';
		}
	
		displayString += "</ul>";
		div.innerHTML = displayString;
	},

	cacheCustomerData : function (response)
	{
		responseArray = response.responseText;
		currentCustomerData = eval(responseArray);

		
		for(i = 0; i < currentCustomerData.length; i++)
		{
			customerID = currentCustomerData[i].customerID;
			this.customerData[customerID] = currentCustomerData[i];
		}
	},

	getCustomerData : function (start, pageSize, div)
	{
		if(this.customerData.length > start)
		{
			this.drawCustomerDIV(start, pageSize, div, true);
			if(div != null)
			{
				this.getCustomerData(start + pageSize, pageSize, null);
			}
		}
		else
		{
			manager = this;			
			options = {
			    method: 'get',
			    parameters: 'start=' + start + '&pageSize=' + pageSize,
			    onSuccess: function(response) {
			    	manager.cacheCustomerData(response);
			    	manager.drawCustomerDIV(start, pageSize, div, false);
			    	if(div != null) 
			    	{
			    		manager.getCustomerData(start + pageSize, pageSize, null);
			    	}
			    },
			    on404: function(response) {
			        alert('Server Status: 404: ' + response.statusText);
			    },
			    onFailure: function(r) {
			        alert('Server Status: ' + response.status + ' - ' + response.statusText);
			    }		   
			};
			
			new Ajax.Request('/ajax/servlet/Customers', options);
			
		}
	},

	
	
	initialize : function() {}
}

