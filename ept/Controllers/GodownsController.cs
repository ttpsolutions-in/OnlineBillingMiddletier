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
    builder.EntitySet<Godown>("Godowns");
    builder.EntitySet<Sale>("Sales"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class GodownsController : ODataController
    {
        private EphraimTradersEntities db = new EphraimTradersEntities();

        // GET: odata/Godowns
        [EnableQuery]
        public IQueryable<Godown> GetGodowns()
        {
            return db.Godowns;
        }

        // GET: odata/Godowns(5)
        [EnableQuery]
        public SingleResult<Godown> GetGodown([FromODataUri] byte key)
        {
            return SingleResult.Create(db.Godowns.Where(godown => godown.GodownId == key));
        }

        // PUT: odata/Godowns(5)
        public IHttpActionResult Put([FromODataUri] byte key, Delta<Godown> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Godown godown = db.Godowns.Find(key);
            if (godown == null)
            {
                return NotFound();
            }

            patch.Put(godown);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GodownExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(godown);
        }

        // POST: odata/Godowns
        public IHttpActionResult Post(Godown godown)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Godowns.Add(godown);
            db.SaveChanges();

            return Created(godown);
        }

        // PATCH: odata/Godowns(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] byte key, Delta<Godown> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Godown godown = db.Godowns.Find(key);
            if (godown == null)
            {
                return NotFound();
            }

            patch.Patch(godown);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GodownExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(godown);
        }

        // DELETE: odata/Godowns(5)
        public IHttpActionResult Delete([FromODataUri] byte key)
        {
            Godown godown = db.Godowns.Find(key);
            if (godown == null)
            {
                return NotFound();
            }

            db.Godowns.Remove(godown);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/Godowns(5)/Sales
        [EnableQuery]
        public IQueryable<Sale> GetSales([FromODataUri] byte key)
        {
            return db.Godowns.Where(m => m.GodownId == key).SelectMany(m => m.Sales);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool GodownExists(byte key)
        {
            return db.Godowns.Count(e => e.GodownId == key) > 0;
        }
    }
}
