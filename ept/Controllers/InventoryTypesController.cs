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
    builder.EntitySet<InventoryType>("InventoryTypes");
    builder.EntitySet<MaterialInventory>("MaterialInventories"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class InventoryTypesController : ODataController
    {
        private EphraimTradersEntities db = new EphraimTradersEntities();

        // GET: odata/InventoryTypes
        [EnableQuery]
        public IQueryable<InventoryType> GetInventoryTypes()
        {
            return db.InventoryTypes;
        }

        // GET: odata/InventoryTypes(5)
        [EnableQuery]
        public SingleResult<InventoryType> GetInventoryType([FromODataUri] byte key)
        {
            return SingleResult.Create(db.InventoryTypes.Where(inventoryType => inventoryType.InventoryTypeId == key));
        }

        // PUT: odata/InventoryTypes(5)
        public async Task<IHttpActionResult> Put([FromODataUri] byte key, Delta<InventoryType> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            InventoryType inventoryType = await db.InventoryTypes.FindAsync(key);
            if (inventoryType == null)
            {
                return NotFound();
            }

            patch.Put(inventoryType);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InventoryTypeExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(inventoryType);
        }

        // POST: odata/InventoryTypes
        public async Task<IHttpActionResult> Post(InventoryType inventoryType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.InventoryTypes.Add(inventoryType);
            await db.SaveChangesAsync();

            return Created(inventoryType);
        }

        // PATCH: odata/InventoryTypes(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] byte key, Delta<InventoryType> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            InventoryType inventoryType = await db.InventoryTypes.FindAsync(key);
            if (inventoryType == null)
            {
                return NotFound();
            }

            patch.Patch(inventoryType);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InventoryTypeExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(inventoryType);
        }

        // DELETE: odata/InventoryTypes(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] byte key)
        {
            InventoryType inventoryType = await db.InventoryTypes.FindAsync(key);
            if (inventoryType == null)
            {
                return NotFound();
            }

            db.InventoryTypes.Remove(inventoryType);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/InventoryTypes(5)/MaterialInventories
        [EnableQuery]
        public IQueryable<MaterialInventory> GetMaterialInventories([FromODataUri] byte key)
        {
            return db.InventoryTypes.Where(m => m.InventoryTypeId == key).SelectMany(m => m.MaterialInventories);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool InventoryTypeExists(byte key)
        {
            return db.InventoryTypes.Count(e => e.InventoryTypeId == key) > 0;
        }
    }
}
