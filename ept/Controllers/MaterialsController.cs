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
    builder.EntitySet<Material>("Materials");
    builder.EntitySet<ItemCategory>("ItemCategories"); 
    builder.EntitySet<MaterialInventory>("MaterialInventories"); 
    builder.EntitySet<Sale>("Sales"); 
    builder.EntitySet<Unit>("Units"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class MaterialsController : ODataController
    {
        private EphraimTradersEntities db = new EphraimTradersEntities();

        // GET: odata/Materials
        [EnableQuery]
        public IQueryable<Material> GetMaterials()
        {
            return db.Materials;
        }

        // GET: odata/Materials(5)
        [EnableQuery]
        public SingleResult<Material> GetMaterial([FromODataUri] int key)
        {
            return SingleResult.Create(db.Materials.Where(material => material.MaterialId == key));
        }

        // PUT: odata/Materials(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<Material> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Material material = await db.Materials.FindAsync(key);
            if (material == null)
            {
                return NotFound();
            }

            patch.Put(material);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MaterialExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(material);
        }

        // POST: odata/Materials
        public async Task<IHttpActionResult> Post(Material material)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Materials.Add(material);
            await db.SaveChangesAsync();

            return Created(material);
        }

        // PATCH: odata/Materials(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<Material> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Material material = await db.Materials.FindAsync(key);
            if (material == null)
            {
                return NotFound();
            }

            patch.Patch(material);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MaterialExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(material);
        }

        // DELETE: odata/Materials(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            Material material = await db.Materials.FindAsync(key);
            if (material == null)
            {
                return NotFound();
            }

            db.Materials.Remove(material);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/Materials(5)/ItemCategory
        [EnableQuery]
        public SingleResult<ItemCategory> GetItemCategory([FromODataUri] int key)
        {
            return SingleResult.Create(db.Materials.Where(m => m.MaterialId == key).Select(m => m.ItemCategory));
        }

        // GET: odata/Materials(5)/MaterialInventories
        [EnableQuery]
        public IQueryable<MaterialInventory> GetMaterialInventories([FromODataUri] int key)
        {
            return db.Materials.Where(m => m.MaterialId == key).SelectMany(m => m.MaterialInventories);
        }

        // GET: odata/Materials(5)/Sales
        [EnableQuery]
        public IQueryable<Sale> GetSales([FromODataUri] int key)
        {
            return db.Materials.Where(m => m.MaterialId == key).SelectMany(m => m.Sales);
        }

        // GET: odata/Materials(5)/Unit
        [EnableQuery]
        public SingleResult<Unit> GetUnit([FromODataUri] int key)
        {
            return SingleResult.Create(db.Materials.Where(m => m.MaterialId == key).Select(m => m.Unit));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool MaterialExists(int key)
        {
            return db.Materials.Count(e => e.MaterialId == key) > 0;
        }
    }
}
