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
    builder.EntitySet<SaleCategory>("SaleCategories";
    builder.EntitySet<Bill>("Bills"; 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class SaleCategoriesController : ODataController
    {
        private EphraimTradersEntities db = new EphraimTradersEntities();

        // GET: odata/SaleCategories
        [EnableQuery]
        public IQueryable<SaleCategory> GetSaleCategories()
        {
            return db.SaleCategories;
        }

        // GET: odata/SaleCategories(5)
        [EnableQuery]
        public SingleResult<SaleCategory> GetSaleCategory([FromODataUri] int key)
        {
            return SingleResult.Create(db.SaleCategories.Where(saleCategory => saleCategory.SaleCategoryId == key));
        }

        // PUT: odata/SaleCategories(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<SaleCategory> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            SaleCategory saleCategory = db.SaleCategories.Find(key);
            if (saleCategory == null)
            {
                return NotFound();
            }

            patch.Put(saleCategory);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SaleCategoryExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(saleCategory);
        }

        // POST: odata/SaleCategories
        public IHttpActionResult Post(SaleCategory saleCategory)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.SaleCategories.Add(saleCategory);
            db.SaveChanges();

            return Created(saleCategory);
        }

        // PATCH: odata/SaleCategories(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<SaleCategory> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            SaleCategory saleCategory = db.SaleCategories.Find(key);
            if (saleCategory == null)
            {
                return NotFound();
            }

            patch.Patch(saleCategory);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SaleCategoryExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(saleCategory);
        }

        // DELETE: odata/SaleCategories(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            SaleCategory saleCategory = db.SaleCategories.Find(key);
            if (saleCategory == null)
            {
                return NotFound();
            }

            db.SaleCategories.Remove(saleCategory);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/SaleCategories(5)/Bills
        [EnableQuery]
        public IQueryable<Bill> GetBills([FromODataUri] int key)
        {
            return db.SaleCategories.Where(m => m.SaleCategoryId == key).SelectMany(m => m.Bills);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SaleCategoryExists(int key)
        {
            return db.SaleCategories.Count(e => e.SaleCategoryId == key) > 0;
        }
    }
}
