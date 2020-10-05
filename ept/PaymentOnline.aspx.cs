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

namespace ept
{
    public partial class PaymentOnline : System.Web.UI.Page
    {
        private EphraimTradersEntities db;
        protected void Page_Load(object sender, EventArgs e)
        {
            string payment_id = string.Empty;
            string transaction_id = string.Empty;
            string id = string.Empty;
            string payment_status = string.Empty;

            if (Request.QueryString["RetailerId"] == null)
                Response.Write("Id is required.");
            else
                Session["RetailerId"] = Request.QueryString["RetailerId"];





            if (Request.QueryString["RetailerId"] != null)
            {
                db = new EphraimTradersEntities();
                int RetailerId = 0;
                RetailerId = Convert.ToInt32(Request.QueryString["RetailerId"]);
                //Session["RetailerId"] = RetailerId;
                IQueryable<SupplierRetailer> result = db.SupplierRetailers.Where(supplierretailer => supplierretailer.SupplierRetailerId == RetailerId);
                //Email.Value = Converter<SupplierRetailers>(result
                foreach (var item in result)
                {
                    Email.Value = item.Email;
                    Phone.Value = item.Contact;
                    Name.Value = item.Name;
                }
            }

        }
        protected void submit_Click(object sender, EventArgs e)
        {
            string Insta_client_id = ConfigurationManager.AppSettings["ClientId"],//   "test_sFhb8ig0JPT0Hc21G2CWZg4RqhO4d3KqMdO",
              Insta_client_secret = ConfigurationManager.AppSettings["ClientSecret"], //"test_7VCjAHfdUrQMtlvUwYUEtAFbYJuvAGZ1Pu63WUfSBWOgsmW8Oa3rgx6AmOsi8UuXeZ3zbFyuPFJMXbEd9rppVFSTXALInXFS3Oa7Ux1hB5NQKAh9OnzvqTSHcV8",
              Insta_Endpoint = ConfigurationManager.AppSettings["APIEndpoint"],// InstamojoConstants.INSTAMOJO_API_ENDPOINT,
            Insta_Auth_Endpoint = ConfigurationManager.AppSettings["AuthEndpoint"];// InstamojoConstants.INSTAMOJO_AUTH_ENDPOINT;
            Instamojo objClass = InstamojoImplementation.getApi(Insta_client_id, Insta_client_secret, Insta_Endpoint, Insta_Auth_Endpoint);

            string responseURL = CreatePaymentOrder(objClass);
            //Response.Write("responseurl: " + responseURL);
            //writelog(responseURL);

            //////////////////////////////////////


            Response.Redirect(responseURL);
        }
        public void writelog(string logtxt)
        {
            // Set a variable to the Documents path.
            string docPath = @"C:\Inetpub\vhosts\ephraimtraders.in\"; //Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);

            // Append text to an existing file named "WriteLines.txt".
            using (StreamWriter outputFile = new StreamWriter(Path.Combine(docPath, "WriteLines.txt"), true))
            {
                outputFile.WriteLine(logtxt);
            }
        }
        private string CreatePaymentOrder(Instamojo objClass)
        {
            var message = "";
            CreatePaymentOrderResponse objPaymentResponse = null;
            PaymentOrder objPaymentRequest = new PaymentOrder();
            ////////////////////
            ///
            /*
            objPaymentRequest.name = "ABCD";
            objPaymentRequest.email = "foo@example.com";
            objPaymentRequest.phone = "0123456789";
            objPaymentRequest.amount = 9;
            objPaymentRequest.transaction_id = "test"; // Unique Id to be provided

            objPaymentRequest.redirect_url = “redirect_url”;
            */
            ///////////////////

            //Required POST parameters
            objPaymentRequest.name = Name.Value;// "ABCD";
            objPaymentRequest.email = Email.Value;// "mung.sukte@gmail.com";
            objPaymentRequest.phone = Phone.Value;// "9920024852";
            objPaymentRequest.description = description.Value;// "Test description";
            objPaymentRequest.amount = Convert.ToInt64(txtAmount.Value);
            //objPaymentRequest.currency = "USD";

            string randomName = Path.GetRandomFileName();
            randomName = randomName.Replace(".", string.Empty);
            objPaymentRequest.transaction_id = randomName;// DateTime.Now.ToString().Replace("-", "").Replace(":", "").Replace(" ", "");

            objPaymentRequest.redirect_url = ConfigurationManager.AppSettings["RedirectUrl"];// "https://ettest.ttpsolutions.in/index.html#/PaymentOnline";
            //objPaymentRequest.webhook_url = ConfigurationManager.AppSettings["WebhookUrl"];// "https://your.server.com/webhook";
            //Extra POST parameters 

            if (objPaymentRequest.validate())
            {
                if (objPaymentRequest.emailInvalid)
                {
                    Response.Write("Email is not valid");
                }
                else if (objPaymentRequest.nameInvalid)
                {
                    Response.Write("Name is not valid");
                }
                else if (objPaymentRequest.phoneInvalid)
                {
                    Response.Write("Phone is not valid");
                }
                else if (objPaymentRequest.amountInvalid)
                {
                    Response.Write("Amount is not valid");
                }
                else if (objPaymentRequest.currencyInvalid)
                {
                    Response.Write("Currency is not valid");
                }
                else if (objPaymentRequest.transactionIdInvalid)
                {
                    Response.Write("Transaction Id is not valid");
                }
                else if (objPaymentRequest.redirectUrlInvalid)
                {
                    Response.Write("Redirect Url Id is not valid");
                }
                else if (objPaymentRequest.webhookUrlInvalid)
                {
                    Response.Write("Webhook URL is not valid");
                }

            }
            else
            {
                try
                {
                    db = new EphraimTradersEntities();
                    objPaymentResponse = objClass.createNewPaymentRequest(objPaymentRequest);
                    message = objPaymentResponse.payment_options.payment_url;
                    OnlinePaymentDetail obj = new OnlinePaymentDetail();

                    obj.name = Name.Value;// "ABCD";
                    obj.email = Email.Value;// "mung.sukte@gmail.com";
                    obj.phone = Phone.Value;// "9920024852";
                    obj.description = description.Value;// "Test description";
                    obj.amount = Convert.ToInt64(txtAmount.Value);
                    obj.TransactionId = objPaymentRequest.transaction_id;
                    obj.CreatedOn = DateTime.Now;
                    obj.CreatedBy = Email.Value;
                    obj.Status = "Pending";
                    db.OnlinePaymentDetails.Add(obj);
                    db.SaveChanges();
                    message = objPaymentResponse.payment_options.payment_url;
                }
                catch (ArgumentNullException ex)
                {
                    Response.Write(ex.Message);
                }
                catch (WebException ex)
                {
                    Response.Write(ex.Message);
                }
                catch (IOException ex)
                {
                    Response.Write(ex.Message);
                }
                catch (InvalidPaymentOrderException ex)
                {
                    if (!ex.IsWebhookValid())
                    {
                        Response.Write("Webhook is invalid");
                    }

                    if (!ex.IsCurrencyValid())
                    {
                        Response.Write("Currency is Invalid");
                    }

                    if (!ex.IsTransactionIDValid())
                    {
                        Response.Write("Transaction ID is Inavlid");
                    }
                }
                catch (ConnectionException ex)
                {
                    Response.Write(ex.Message);
                }
                catch (BaseException ex)
                {
                    Response.Write(ex.Message);
                }
                catch (Exception ex)
                {
                    Response.Write("Error:" + ex.Message);
                }
            }
            return message;


        }
    }

}