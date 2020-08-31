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
    builder.EntitySet<Bill>("Bills");
    builder.EntitySet<Status>("Status"); 
    builder.EntitySet<SupplierRetailer>("SupplierRetailers"); 
    builder.EntitySet<SaleCategory>("SaleCategories"); 
    builder.EntitySet<SaleType>("SaleTypes"); 
    builder.EntitySet<Sale>("Sales"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class BillsController : ODataController
    {
        private EphraimTradersEntities db = new EphraimTradersEntities();

        // GET: odata/Bills
        [EnableQuery]
        public IQueryable<Bill> GetBills()
        {
            return db.Bills;
        }

        // GET: odata/Bills(5)
        [EnableQuery]
        public SingleResult<Bill> GetBill([FromODataUri] int key)
        {
            return SingleResult.Create(db.Bills.Where(bill => bill.BillNo == key));
        }

        // PUT: odata/Bills(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<Bill> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Bill bill = db.Bills.Find(key);
            if (bill == null)
            {
                return NotFound();
            }

            patch.Put(bill);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BillExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(bill);
        }

        // POST: odata/Bills
        public IHttpActionResult Post(Bill bill)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Bills.Add(bill);
            db.SaveChanges();

            return Created(bill);
        }

        // PATCH: odata/Bills(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<Bill> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Bill bill = db.Bills.Find(key);
            if (bill == null)
            {
                return NotFound();
            }

            patch.Patch(bill);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BillExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(bill);
        }

        // DELETE: odata/Bills(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            Bill bill = db.Bills.Find(key);
            if (bill == null)
            {
                return NotFound();
            }

            db.Bills.Remove(bill);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/Bills(5)/Status
        [EnableQuery]
        public SingleResult<Status> GetStatus([FromODataUri] int key)
        {
            return SingleResult.Create(db.Bills.Where(m => m.BillNo == key).Select(m => m.Status));
        }

        // GET: odata/Bills(5)/SupplierRetailer
        [EnableQuery]
        public SingleResult<SupplierRetailer> GetSupplierRetailer([FromODataUri] int key)
        {
            return SingleResult.Create(db.Bills.Where(m => m.BillNo == key).Select(m => m.SupplierRetailer));
        }

        // GET: odata/Bills(5)/SaleCategory
        [EnableQuery]
        public SingleResult<SaleCategory> GetSaleCategory([FromODataUri] int key)
        {
            return SingleResult.Create(db.Bills.Where(m => m.BillNo == key).Select(m => m.SaleCategory));
        }

        // GET: odata/Bills(5)/SaleType
        [EnableQuery]
        public SingleResult<SaleType> GetSaleType([FromODataUri] int key)
        {
            return SingleResult.Create(db.Bills.Where(m => m.BillNo == key).Select(m => m.SaleType));
        }

        // GET: odata/Bills(5)/Sales
        [EnableQuery]
        public IQueryable<Sale> GetSales([FromODataUri] int key)
        {
            return db.Bills.Where(m => m.BillNo == key).SelectMany(m => m.Sales);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool BillExists(int key)
        {
            return db.Bills.Count(e => e.BillNo == key) > 0;
        }
    }
}
