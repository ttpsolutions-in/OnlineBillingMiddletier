using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Web.Http.OData;
using System.Web.Http.OData.Routing;
using ept.Models;

namespace ept.Controllers
{
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using System.Web.Http.OData.Builder;
    using System.Web.Http.OData.Extensions;
    using ept.Models;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<OnlinePaymentDetail>("OnlinePaymentDetails");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class OnlinePaymentDetailsController : ODataController
    {
        private EphraimTradersEntities db = new EphraimTradersEntities();

        // GET: odata/OnlinePaymentDetails
        [EnableQuery]
        public IQueryable<OnlinePaymentDetail> GetOnlinePaymentDetails()
        {
            return db.OnlinePaymentDetails;
        }

        // GET: odata/OnlinePaymentDetails(5)
        [EnableQuery]
        public SingleResult<OnlinePaymentDetail> GetOnlinePaymentDetail([FromODataUri] int key)
        {
            return SingleResult.Create(db.OnlinePaymentDetails.Where(onlinePaymentDetail => onlinePaymentDetail.OnlinePaymentId == key));
        }

        // PUT: odata/OnlinePaymentDetails(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<OnlinePaymentDetail> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            OnlinePaymentDetail onlinePaymentDetail = await db.OnlinePaymentDetails.FindAsync(key);
            if (onlinePaymentDetail == null)
            {
                return NotFound();
            }

            patch.Put(onlinePaymentDetail);

            try
            {
                
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OnlinePaymentDetailExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(onlinePaymentDetail);
        }

        // POST: odata/OnlinePaymentDetails
        public async Task<IHttpActionResult> Post(OnlinePaymentDetail onlinePaymentDetail)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.OnlinePaymentDetails.Add(onlinePaymentDetail);
            await db.SaveChangesAsync();

            return Created(onlinePaymentDetail);
        }

        // PATCH: odata/OnlinePaymentDetails(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<OnlinePaymentDetail> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            OnlinePaymentDetail onlinePaymentDetail = await db.OnlinePaymentDetails.FindAsync(key);
            if (onlinePaymentDetail == null)
            {
                return NotFound();
            }

            patch.Patch(onlinePaymentDetail);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OnlinePaymentDetailExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(onlinePaymentDetail);
        }

        // DELETE: odata/OnlinePaymentDetails(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            OnlinePaymentDetail onlinePaymentDetail = await db.OnlinePaymentDetails.FindAsync(key);
            if (onlinePaymentDetail == null)
            {
                return NotFound();
            }

            db.OnlinePaymentDetails.Remove(onlinePaymentDetail);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool OnlinePaymentDetailExists(int key)
        {
            return db.OnlinePaymentDetails.Count(e => e.OnlinePaymentId == key) > 0;
        }
    }
}
