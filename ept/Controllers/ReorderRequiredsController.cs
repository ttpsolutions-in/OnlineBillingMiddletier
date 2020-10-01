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
    builder.EntitySet<ReorderRequired>("ReorderRequireds";
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class ReorderRequiredsController : ODataController
    {
        private EphraimTradersEntities db = new EphraimTradersEntities();

        // GET: odata/ReorderRequireds
        [EnableQuery]
        public IQueryable<ReorderRequired> GetReorderRequireds()
        {
            return db.ReorderRequireds;
        }

        // GET: odata/ReorderRequireds(5)
        [EnableQuery]
        public SingleResult<ReorderRequired> GetReorderRequired([FromODataUri] int key)
        {
            return SingleResult.Create(db.ReorderRequireds.Where(reorderRequired => reorderRequired.MaterialId == key));
        }

        // PUT: odata/ReorderRequireds(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<ReorderRequired> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            ReorderRequired reorderRequired = db.ReorderRequireds.Find(key);
            if (reorderRequired == null)
            {
                return NotFound();
            }

            patch.Put(reorderRequired);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReorderRequiredExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(reorderRequired);
        }

        // POST: odata/ReorderRequireds
        public IHttpActionResult Post(ReorderRequired reorderRequired)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.ReorderRequireds.Add(reorderRequired);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (ReorderRequiredExists(reorderRequired.MaterialId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(reorderRequired);
        }

        // PATCH: odata/ReorderRequireds(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<ReorderRequired> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            ReorderRequired reorderRequired = db.ReorderRequireds.Find(key);
            if (reorderRequired == null)
            {
                return NotFound();
            }

            patch.Patch(reorderRequired);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReorderRequiredExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(reorderRequired);
        }

        // DELETE: odata/ReorderRequireds(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            ReorderRequired reorderRequired = db.ReorderRequireds.Find(key);
            if (reorderRequired == null)
            {
                return NotFound();
            }

            db.ReorderRequireds.Remove(reorderRequired);
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

        private bool ReorderRequiredExists(int key)
        {
            return db.ReorderRequireds.Count(e => e.MaterialId == key) > 0;
        }
    }
}
