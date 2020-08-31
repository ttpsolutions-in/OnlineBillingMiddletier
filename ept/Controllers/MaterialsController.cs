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
    builder.EntitySet<Material>("Materials");
    builder.EntitySet<Sale>("Sales"); 
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
        public IHttpActionResult Put([FromODataUri] int key, Delta<Material> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Material material = db.Materials.Find(key);
            if (material == null)
            {
                return NotFound();
            }

            patch.Put(material);

            try
            {
                db.SaveChanges();
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
        public IHttpActionResult Post(Material material)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Materials.Add(material);
            db.SaveChanges();

            return Created(material);
        }

        // PATCH: odata/Materials(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<Material> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Material material = db.Materials.Find(key);
            if (material == null)
            {
                return NotFound();
            }

            patch.Patch(material);

            try
            {
                db.SaveChanges();
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
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            Material material = db.Materials.Find(key);
            if (material == null)
            {
                return NotFound();
            }

            db.Materials.Remove(material);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/Materials(5)/Sales
        [EnableQuery]
        public IQueryable<Sale> GetSales([FromODataUri] int key)
        {
            return db.Materials.Where(m => m.MaterialId == key).SelectMany(m => m.Sales);
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
