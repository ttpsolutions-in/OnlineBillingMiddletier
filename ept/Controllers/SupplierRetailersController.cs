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
    builder.EntitySet<SupplierRetailer>("SupplierRetailers");
    builder.EntitySet<Bill>("Bills"); 
    builder.EntitySet<Category>("Categories"); 
    builder.EntitySet<SupplierRetailType>("SupplierRetailTypes"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class SupplierRetailersController : ODataController
    {
        private EphraimTradersEntities db = new EphraimTradersEntities();

        // GET: odata/SupplierRetailers
        [EnableQuery]
        public IQueryable<SupplierRetailer> GetSupplierRetailers()
        {
            return db.SupplierRetailers;
        }

        // GET: odata/SupplierRetailers(5)
        [EnableQuery]
        public SingleResult<SupplierRetailer> GetSupplierRetailer([FromODataUri] int key)
        {
            return SingleResult.Create(db.SupplierRetailers.Where(supplierRetailer => supplierRetailer.SupplierRetailerId == key));
        }

        // PUT: odata/SupplierRetailers(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<SupplierRetailer> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            SupplierRetailer supplierRetailer = db.SupplierRetailers.Find(key);
            if (supplierRetailer == null)
            {
                return NotFound();
            }

            patch.Put(supplierRetailer);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SupplierRetailerExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(supplierRetailer);
        }

        // POST: odata/SupplierRetailers
        public IHttpActionResult Post(SupplierRetailer supplierRetailer)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.SupplierRetailers.Add(supplierRetailer);
            db.SaveChanges();

            return Created(supplierRetailer);
        }

        // PATCH: odata/SupplierRetailers(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<SupplierRetailer> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            SupplierRetailer supplierRetailer = db.SupplierRetailers.Find(key);
            if (supplierRetailer == null)
            {
                return NotFound();
            }

            patch.Patch(supplierRetailer);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SupplierRetailerExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(supplierRetailer);
        }

        // DELETE: odata/SupplierRetailers(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            SupplierRetailer supplierRetailer = db.SupplierRetailers.Find(key);
            if (supplierRetailer == null)
            {
                return NotFound();
            }

            db.SupplierRetailers.Remove(supplierRetailer);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/SupplierRetailers(5)/Bills
        [EnableQuery]
        public IQueryable<Bill> GetBills([FromODataUri] int key)
        {
            return db.SupplierRetailers.Where(m => m.SupplierRetailerId == key).SelectMany(m => m.Bills);
        }

        // GET: odata/SupplierRetailers(5)/Category1
        [EnableQuery]
        public SingleResult<Category> GetCategory1([FromODataUri] int key)
        {
            return SingleResult.Create(db.SupplierRetailers.Where(m => m.SupplierRetailerId == key).Select(m => m.Category1));
        }

        // GET: odata/SupplierRetailers(5)/SupplierRetailType
        [EnableQuery]
        public SingleResult<SupplierRetailType> GetSupplierRetailType([FromODataUri] int key)
        {
            return SingleResult.Create(db.SupplierRetailers.Where(m => m.SupplierRetailerId == key).Select(m => m.SupplierRetailType));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SupplierRetailerExists(int key)
        {
            return db.SupplierRetailers.Count(e => e.SupplierRetailerId == key) > 0;
        }
    }
}
