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
    builder.EntitySet<SupplierRetailType>("SupplierRetailTypes";
    builder.EntitySet<SupplierRetailer>("SupplierRetailers"; 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class SupplierRetailTypesController : ODataController
    {
        private EphraimTradersEntities db = new EphraimTradersEntities();

        // GET: odata/SupplierRetailTypes
        [EnableQuery]
        public IQueryable<SupplierRetailType> GetSupplierRetailTypes()
        {
            return db.SupplierRetailTypes;
        }

        // GET: odata/SupplierRetailTypes(5)
        [EnableQuery]
        public SingleResult<SupplierRetailType> GetSupplierRetailType([FromODataUri] byte key)
        {
            return SingleResult.Create(db.SupplierRetailTypes.Where(supplierRetailType => supplierRetailType.SRId == key));
        }

        // PUT: odata/SupplierRetailTypes(5)
        public IHttpActionResult Put([FromODataUri] byte key, Delta<SupplierRetailType> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            SupplierRetailType supplierRetailType = db.SupplierRetailTypes.Find(key);
            if (supplierRetailType == null)
            {
                return NotFound();
            }

            patch.Put(supplierRetailType);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SupplierRetailTypeExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(supplierRetailType);
        }

        // POST: odata/SupplierRetailTypes
        public IHttpActionResult Post(SupplierRetailType supplierRetailType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.SupplierRetailTypes.Add(supplierRetailType);
            db.SaveChanges();

            return Created(supplierRetailType);
        }

        // PATCH: odata/SupplierRetailTypes(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] byte key, Delta<SupplierRetailType> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            SupplierRetailType supplierRetailType = db.SupplierRetailTypes.Find(key);
            if (supplierRetailType == null)
            {
                return NotFound();
            }

            patch.Patch(supplierRetailType);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SupplierRetailTypeExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(supplierRetailType);
        }

        // DELETE: odata/SupplierRetailTypes(5)
        public IHttpActionResult Delete([FromODataUri] byte key)
        {
            SupplierRetailType supplierRetailType = db.SupplierRetailTypes.Find(key);
            if (supplierRetailType == null)
            {
                return NotFound();
            }

            db.SupplierRetailTypes.Remove(supplierRetailType);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/SupplierRetailTypes(5)/SupplierRetailers
        [EnableQuery]
        public IQueryable<SupplierRetailer> GetSupplierRetailers([FromODataUri] byte key)
        {
            return db.SupplierRetailTypes.Where(m => m.SRId == key).SelectMany(m => m.SupplierRetailers);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SupplierRetailTypeExists(byte key)
        {
            return db.SupplierRetailTypes.Count(e => e.SRId == key) > 0;
        }
    }
}
