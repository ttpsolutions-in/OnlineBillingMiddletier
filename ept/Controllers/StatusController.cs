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
    builder.EntitySet<Status>("Status");
    builder.EntitySet<Bill>("Bills"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class StatusController : ODataController
    {
        private EphraimTradersEntities db = new EphraimTradersEntities();

        // GET: odata/Status
        [EnableQuery]
        public IQueryable<Status> GetStatus()
        {
            return db.Status;
        }

        // GET: odata/Status(5)
        [EnableQuery]
        public SingleResult<Status> GetStatus([FromODataUri] byte key)
        {
            return SingleResult.Create(db.Status.Where(status => status.StatusId == key));
        }

        // PUT: odata/Status(5)
        public IHttpActionResult Put([FromODataUri] byte key, Delta<Status> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Status status = db.Status.Find(key);
            if (status == null)
            {
                return NotFound();
            }

            patch.Put(status);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StatusExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(status);
        }

        // POST: odata/Status
        public IHttpActionResult Post(Status status)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Status.Add(status);
            db.SaveChanges();

            return Created(status);
        }

        // PATCH: odata/Status(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] byte key, Delta<Status> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Status status = db.Status.Find(key);
            if (status == null)
            {
                return NotFound();
            }

            patch.Patch(status);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StatusExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(status);
        }

        // DELETE: odata/Status(5)
        public IHttpActionResult Delete([FromODataUri] byte key)
        {
            Status status = db.Status.Find(key);
            if (status == null)
            {
                return NotFound();
            }

            db.Status.Remove(status);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/Status(5)/Bills
        [EnableQuery]
        public IQueryable<Bill> GetBills([FromODataUri] byte key)
        {
            return db.Status.Where(m => m.StatusId == key).SelectMany(m => m.Bills);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool StatusExists(byte key)
        {
            return db.Status.Count(e => e.StatusId == key) > 0;
        }
    }
}
