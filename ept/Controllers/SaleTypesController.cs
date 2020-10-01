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
    builder.EntitySet<SaleType>("SaleTypes";
    builder.EntitySet<Bill>("Bills"; 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class SaleTypesController : ODataController
    {
        private EphraimTradersEntities db = new EphraimTradersEntities();

        // GET: odata/SaleTypes
        [EnableQuery]
        public IQueryable<SaleType> GetSaleTypes()
        {
            return db.SaleTypes;
        }

        // GET: odata/SaleTypes(5)
        [EnableQuery]
        public SingleResult<SaleType> GetSaleType([FromODataUri] int key)
        {
            return SingleResult.Create(db.SaleTypes.Where(saleType => saleType.SaleTypeId == key));
        }

        // PUT: odata/SaleTypes(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<SaleType> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            SaleType saleType = db.SaleTypes.Find(key);
            if (saleType == null)
            {
                return NotFound();
            }

            patch.Put(saleType);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SaleTypeExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(saleType);
        }

        // POST: odata/SaleTypes
        public IHttpActionResult Post(SaleType saleType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.SaleTypes.Add(saleType);
            db.SaveChanges();

            return Created(saleType);
        }

        // PATCH: odata/SaleTypes(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<SaleType> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            SaleType saleType = db.SaleTypes.Find(key);
            if (saleType == null)
            {
                return NotFound();
            }

            patch.Patch(saleType);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SaleTypeExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(saleType);
        }

        // DELETE: odata/SaleTypes(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            SaleType saleType = db.SaleTypes.Find(key);
            if (saleType == null)
            {
                return NotFound();
            }

            db.SaleTypes.Remove(saleType);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/SaleTypes(5)/Bills
        [EnableQuery]
        public IQueryable<Bill> GetBills([FromODataUri] int key)
        {
            return db.SaleTypes.Where(m => m.SaleTypeId == key).SelectMany(m => m.Bills);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SaleTypeExists(int key)
        {
            return db.SaleTypes.Count(e => e.SaleTypeId == key) > 0;
        }
    }
}
