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
    builder.EntitySet<Godown>("Godowns";
    builder.EntitySet<Sale>("Sales"; 
    builder.EntitySet<MaterialInventory>("MaterialInventories"; 
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
        public SingleResult<Godown> GetGodown([FromODataUri] short key)
        {
            return SingleResult.Create(db.Godowns.Where(godown => godown.GodownId == key));
        }

        // PUT: odata/Godowns(5)
        public async Task<IHttpActionResult> Put([FromODataUri] short key, Delta<Godown> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Godown godown = await db.Godowns.FindAsync(key);
            if (godown == null)
            {
                return NotFound();
            }

            patch.Put(godown);

            try
            {
                await db.SaveChangesAsync();
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
        public async Task<IHttpActionResult> Post(Godown godown)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Godowns.Add(godown);
            await db.SaveChangesAsync();

            return Created(godown);
        }

        // PATCH: odata/Godowns(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] short key, Delta<Godown> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Godown godown = await db.Godowns.FindAsync(key);
            if (godown == null)
            {
                return NotFound();
            }

            patch.Patch(godown);

            try
            {
                await db.SaveChangesAsync();
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
        public async Task<IHttpActionResult> Delete([FromODataUri] short key)
        {
            Godown godown = await db.Godowns.FindAsync(key);
            if (godown == null)
            {
                return NotFound();
            }

            db.Godowns.Remove(godown);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/Godowns(5)/Sales
        [EnableQuery]
        public IQueryable<Sale> GetSales([FromODataUri] short key)
        {
            return db.Godowns.Where(m => m.GodownId == key).SelectMany(m => m.Sales);
        }

        // GET: odata/Godowns(5)/MaterialInventories
        [EnableQuery]
        public IQueryable<MaterialInventory> GetMaterialInventories([FromODataUri] short key)
        {
            return db.Godowns.Where(m => m.GodownId == key).SelectMany(m => m.MaterialInventories);
        }

        // GET: odata/Godowns(5)/MaterialInventories1
        [EnableQuery]
        public IQueryable<MaterialInventory> GetMaterialInventories1([FromODataUri] short key)
        {
            return db.Godowns.Where(m => m.GodownId == key).SelectMany(m => m.MaterialInventories1);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool GodownExists(short key)
        {
            return db.Godowns.Count(e => e.GodownId == key) > 0;
        }
    }
}
