using ept.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;


namespace ept
{
    public partial class WebHookToInstamojo : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                EphraimTradersEntities db = new EphraimTradersEntities();
                ept.Models.OnlinePaymentDetail objOnlinePaymentDetails = new OnlinePaymentDetail();
                if (Request["amount"] != null)
                    objOnlinePaymentDetails.amount = Convert.ToDecimal(Request["amount"]);
                if (Request["buyer"] != null)
                    objOnlinePaymentDetails.email = Request["buyer"].ToString();
                if (Request["buyer_name"] != null)
                    objOnlinePaymentDetails.name = Request["buyer_name"].ToString();
                if (Request["buyer_phone"] != null)
                    objOnlinePaymentDetails.phone = Request["buyer_phone"].ToString();
                if (Request["currency"] != null)
                    objOnlinePaymentDetails.currency = Request["currency"].ToString();
                if (Request["fees"] != null)
                    objOnlinePaymentDetails.Fees = Convert.ToDecimal(Request["fees"]);
                if (Request["mac"] != null)
                    objOnlinePaymentDetails.MAC = Request["mac"].ToString();
                if (Request["longurl"] != null)
                    objOnlinePaymentDetails.LongUrl = Request["longurl"].ToString();
                if (Request["payment_id"] != null)
                    objOnlinePaymentDetails.InstamojoPaymentId = Request["payment_id"].ToString();
                if (Request["payment_request_id"] != null)
                    objOnlinePaymentDetails.RequestId = Request["payment_request_id"].ToString();
                if (Request["purpose"] != null)
                    objOnlinePaymentDetails.description = Request["purpose"].ToString();
                if (Request["shorturl"] != null)
                    objOnlinePaymentDetails.ShortUrl = Request["shorturl"].ToString();
                if (Request["status"] != null)
                    objOnlinePaymentDetails.Status = Request["status"].ToString();

                objOnlinePaymentDetails.CreatedBy = Request["buyer"].ToString();
                objOnlinePaymentDetails.CreatedOn = DateTime.Now;

                db.OnlinePaymentDetails.Add(objOnlinePaymentDetails);
                db.SaveChanges();
            }
            catch (Exception ex)
            {

                writelog(ex.Message);
            }
        }
        public void writelog(string logtxt)
        {
            // Set a variable to the Documents path.
            string docPath = @"C:\Inetpub\vhosts\ephraimtraders.in\"; //Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);

            // Append text to an existing file named "WriteLines.txt".
            using (StreamWriter outputFile = new StreamWriter(Path.Combine(docPath, "WriteLines.txt"), true))
            {
                outputFile.WriteLine(logtxt + "\t" + DateTime.Now.ToString());
            }
        }
    }
}