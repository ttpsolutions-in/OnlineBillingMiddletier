using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
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
    builder.EntitySet<BillDetailsView>("BillDetailsViews");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class BillDetailsViewsController : ODataController
    {
        private EphraimTradersEntities db = new EphraimTradersEntities();

        // GET: odata/BillDetailsViews
        [EnableQuery]
        public IQueryable<BillDetailsView> GetBillDetailsViews()
        {
            return db.BillDetailsViews;
        }

        // GET: odata/BillDetailsViews(5)
        [EnableQuery]
        public SingleResult<BillDetailsView> GetBillDetailsView([FromODataUri] int key)
        {
            return SingleResult.Create(db.BillDetailsViews.Where(billDetailsView => billDetailsView.BillNo == key));
        }

        // PUT: odata/BillDetailsViews(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<BillDetailsView> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            BillDetailsView billDetailsView = db.BillDetailsViews.Find(key);
            if (billDetailsView == null)
            {
                return NotFound();
            }

            patch.Put(billDetailsView);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BillDetailsViewExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(billDetailsView);
        }

        // POST: odata/BillDetailsViews
        public IHttpActionResult Post(BillDetailsView billDetailsView)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.BillDetailsViews.Add(billDetailsView);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (BillDetailsViewExists(billDetailsView.BillNo))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(billDetailsView);
        }

        // PATCH: odata/BillDetailsViews(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<BillDetailsView> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            BillDetailsView billDetailsView = db.BillDetailsViews.Find(key);
            if (billDetailsView == null)
            {
                return NotFound();
            }

            patch.Patch(billDetailsView);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BillDetailsViewExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(billDetailsView);
        }

        // DELETE: odata/BillDetailsViews(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            BillDetailsView billDetailsView = db.BillDetailsViews.Find(key);
            if (billDetailsView == null)
            {
                return NotFound();
            }

            db.BillDetailsViews.Remove(billDetailsView);
            db.SaveChanges();

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

        private bool BillDetailsViewExists(int key)
        {
            return db.BillDetailsViews.Count(e => e.BillNo == key) > 0;
        }
    }
}
