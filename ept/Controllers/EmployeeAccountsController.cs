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
    builder.EntitySet<EmployeeAccount>("EmployeeAccounts");
    builder.EntitySet<EmployeeDetail>("EmployeeDetails"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class EmployeeAccountsController : ODataController
    {
        private EphraimTradersEntities db = new EphraimTradersEntities();

        // GET: odata/EmployeeAccounts
        [EnableQuery]
        public IQueryable<EmployeeAccount> GetEmployeeAccounts()
        {
            return db.EmployeeAccounts;
        }

        // GET: odata/EmployeeAccounts(5)
        [EnableQuery]
        public SingleResult<EmployeeAccount> GetEmployeeAccount([FromODataUri] short key)
        {
            return SingleResult.Create(db.EmployeeAccounts.Where(employeeAccount => employeeAccount.EmpAccountId == key));
        }

        // PUT: odata/EmployeeAccounts(5)
        public async Task<IHttpActionResult> Put([FromODataUri] short key, Delta<EmployeeAccount> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            EmployeeAccount employeeAccount = await db.EmployeeAccounts.FindAsync(key);
            if (employeeAccount == null)
            {
                return NotFound();
            }

            patch.Put(employeeAccount);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeAccountExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(employeeAccount);
        }

        // POST: odata/EmployeeAccounts
        public async Task<IHttpActionResult> Post(EmployeeAccount employeeAccount)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.EmployeeAccounts.Add(employeeAccount);
            await db.SaveChangesAsync();

            return Created(employeeAccount);
        }

        // PATCH: odata/EmployeeAccounts(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] short key, Delta<EmployeeAccount> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            EmployeeAccount employeeAccount = await db.EmployeeAccounts.FindAsync(key);
            if (employeeAccount == null)
            {
                return NotFound();
            }

            patch.Patch(employeeAccount);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeAccountExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(employeeAccount);
        }

        // DELETE: odata/EmployeeAccounts(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] short key)
        {
            EmployeeAccount employeeAccount = await db.EmployeeAccounts.FindAsync(key);
            if (employeeAccount == null)
            {
                return NotFound();
            }

            db.EmployeeAccounts.Remove(employeeAccount);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/EmployeeAccounts(5)/EmployeeDetail
        [EnableQuery]
        public SingleResult<EmployeeDetail> GetEmployeeDetail([FromODataUri] short key)
        {
            return SingleResult.Create(db.EmployeeAccounts.Where(m => m.EmpAccountId == key).Select(m => m.EmployeeDetail));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool EmployeeAccountExists(short key)
        {
            return db.EmployeeAccounts.Count(e => e.EmpAccountId == key) > 0;
        }
    }
}
