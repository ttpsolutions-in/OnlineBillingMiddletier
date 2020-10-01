using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ept.Models
{    
    public class ClientMasterRepository : IDisposable
    {
        EphraimTradersEntities context = new EphraimTradersEntities();
        // SECURITY_DBEntities it is your context class
        //SECURITY_DBEntities context = new SECURITY_DBEntities();

        //This method is used to check and validate the Client credentials
        public ClientMaster ValidateClient(string ClientID)//, string ClientSecret)
        {
            return context.ClientMasters.FirstOrDefault(user =>
             user.ClientID == ClientID);
            //&& user.ClientSecret == ClientSecret);
        }

        public void Dispose()
        {
            context.Dispose();
        }
    }
}