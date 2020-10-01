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
    builder.EntitySet<MaterialInventory>("MaterialInventories";
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class MaterialInventoriesController : ODataController
    {
        private EphraimTradersEntities db = new EphraimTradersEntities();

        // GET: odata/MaterialInventories
        [EnableQuery]
        public IQueryable<MaterialInventory> GetMaterialInventories()
        {
            return db.MaterialInventories;
        }

        // GET: odata/MaterialInventories(5)
        [EnableQuery]
        public SingleResult<MaterialInventory> GetMaterialInventory([FromODataUri] int key)
        {
            return SingleResult.Create(db.MaterialInventories.Where(materialInventory => materialInventory.InventoryId == key));
        }

        // PUT: odata/MaterialInventories(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<MaterialInventory> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            MaterialInventory materialInventory = db.MaterialInventories.Find(key);
            if (materialInventory == null)
            {
                return NotFound();
            }

            patch.Put(materialInventory);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MaterialInventoryExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(materialInventory);
        }

        // POST: odata/MaterialInventories
        public IHttpActionResult Post(MaterialInventory materialInventory)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.MaterialInventories.Add(materialInventory);
            db.SaveChanges();

            return Created(materialInventory);
        }

        // PATCH: odata/MaterialInventories(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<MaterialInventory> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            MaterialInventory materialInventory = db.MaterialInventories.Find(key);
            if (materialInventory == null)
            {
                return NotFound();
            }

            patch.Patch(materialInventory);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MaterialInventoryExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(materialInventory);
        }

        // DELETE: odata/MaterialInventories(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            MaterialInventory materialInventory = db.MaterialInventories.Find(key);
            if (materialInventory == null)
            {
                return NotFound();
            }

            db.MaterialInventories.Remove(materialInventory);
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

        private bool MaterialInventoryExists(int key)
        {
            return db.MaterialInventories.Count(e => e.InventoryId == key) > 0;
        }
    }
}
