using ept.Controllers;
using ept.Models;
using InstamojoAPI;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Http;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Configuration;
using System.Configuration;
using System.Web.WebPages;
using Microsoft.Ajax.Utilities;
using System.Runtime.InteropServices;
using System.Reflection;

namespace ept
{
    public partial class PaymntDetail : System.Web.UI.Page
    {
        private EphraimTradersEntities db;
        protected void Page_Load(object sender, EventArgs e)
        {


                db = new EphraimTradersEntities();
                IQueryable<OnlinepaymentFromWebhook> result = db.OnlinepaymentFromWebhooks;
                //Email.Value = Converter<SupplierRetailers>(result                    
                foreach (var item in result)
                {
                    ddlPaymentId.Items.Add(new ListItem(item.payment_id, item.payment_id));
                    ddlTranId.Items.Add(new ListItem(item.id, item.id));
                }

        }
        protected void submit_Click(object sender, EventArgs e)
        {
            string Insta_client_id = ConfigurationManager.AppSettings["ClientId"];//,//   "test_sFhb8ig0JPT0Hc21G2CWZg4RqhO4d3KqMdO",
            string Insta_client_secret = ConfigurationManager.AppSettings["ClientSecret"];//, //"test_7VCjAHfdUrQMtlvUwYUEtAFbYJuvAGZ1Pu63WUfSBWOgsmW8Oa3rgx6AmOsi8UuXeZ3zbFyuPFJMXbEd9rppVFSTXALInXFS3Oa7Ux1hB5NQKAh9OnzvqTSHcV8",
            string Insta_Endpoint = "";//ConfigurationManager.AppSettings["APIEndpoint"],// InstamojoConstants.INSTAMOJO_API_ENDPOINT,
            string Insta_Auth_Endpoint = "";//ConfigurationManager.AppSettings["AuthEndpoint"];// InstamojoConstants.INSTAMOJO_AUTH_ENDPOINT;
            //bool validPayment = false;
            Insta_Endpoint = ConfigurationManager.AppSettings["APIEndpoint"];
            Insta_Auth_Endpoint = ConfigurationManager.AppSettings["AuthEndpoint"];

            /*
             * if (paymenttype == "fromcustomer")
            {*/
            Insta_client_id = ConfigurationManager.AppSettings["ClientId"];
            Insta_client_secret = ConfigurationManager.AppSettings["ClientSecret"];
            //    validPayment = true;
            /*}
            else if (paymenttype == "tosupplier")
            {
                Insta_client_id = ClientId.Value;
                Insta_client_secret = ClientSecret.Value;
                validPayment = true;
            }
            else
                Response.Write("Invalid Payment type");
            */
            Instamojo objClass = InstamojoImplementation.getApi(Insta_client_id, Insta_client_secret, Insta_Endpoint, Insta_Auth_Endpoint);

            try
            {
                PaymentOrderListRequest objPaymentOrderListRequest = new PaymentOrderListRequest();
                //Optional Parameters
                objPaymentOrderListRequest.limit = 20;
                objPaymentOrderListRequest.page = 3;

                //PaymentOrderListResponse objPaymentRequestStatusResponse = objClass.getPaymentOrderList(objPaymentOrderListRequest);
                PaymentOrderDetailsResponse objPaymentRequestStatusResponse = objClass.getPaymentOrderDetails(ddlTranId.SelectedValue);
                List<PaymentOrderDetailsResponse> objlist = new List<PaymentOrderDetailsResponse>();
                objlist.Add(objPaymentRequestStatusResponse);
                GridView1.DataSource = objlist;
                GridView1.DataBind();


                //PropertyInfo[] properties = typeof(Order).GetProperties();
                //foreach (var item in objPaymentRequestStatusResponse.orders)
                //{
                //    Response.Write("Id :" + item.id ,);

                //}

                //MessageBox.Show("Order Count = " + objPaymentRequestStatusResponse.orders.Count());
            }
            catch (Exception ex)
            {
                Response.Write("Error:" + ex.Message);
            }



            //if (validPayment)
            //{
            //    Insta_Endpoint = ConfigurationManager.AppSettings["APIEndpoint"];
            //    Insta_Auth_Endpoint = ConfigurationManager.AppSettings["AuthEndpoint"];

            //    Instamojo objClass = InstamojoImplementation.getApi(Insta_client_id, Insta_client_secret, Insta_Endpoint, Insta_Auth_Endpoint);

            //    string responseURL = CreatePaymentOrder(objClass);

            //    Response.Redirect(responseURL);
            //}
        }
        public void writelog(string logtxt)
        {
            // Set a variable to the Documents path.
            string docPath = @"C:\inetpub\vhosts\PaymentLog\"; //Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);

            // Append text to an existing file named "WriteLines.txt".
            using (StreamWriter outputFile = new StreamWriter(Path.Combine(docPath, "WriteLines.txt"), true))
            {
                outputFile.WriteLine(logtxt);
            }
        }

    }

}