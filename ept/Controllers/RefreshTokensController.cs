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
using System.Web.Http.Description;
using ept.Models;

namespace ept.Controllers
{
    [RoutePrefix("api/RefreshTokens")]
    public class RefreshTokensController : ApiController
    {
        private EphraimTradersEntities db = new EphraimTradersEntities();

        // GET: api/RefreshTokens
        public IQueryable<RefreshToken> GetRefreshTokens()
        {
            return db.RefreshTokens;
        }

        // GET: api/RefreshTokens/5
        [Authorize(Users = "Admin")]
        [Route("")]
        [ResponseType(typeof(RefreshToken))]
        public async Task<IHttpActionResult> GetRefreshToken(string id)
        {
            RefreshToken refreshToken = await db.RefreshTokens.FindAsync(id);
            if (refreshToken == null)
            {
                return NotFound();
            }

            return Ok(refreshToken);
        }

        // PUT: api/RefreshTokens/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutRefreshToken(string id, RefreshToken refreshToken)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != refreshToken.Id)
            {
                return BadRequest();
            }

            db.Entry(refreshToken).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RefreshTokenExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/RefreshTokens
        [ResponseType(typeof(RefreshToken))]
        public async Task<IHttpActionResult> PostRefreshToken(RefreshToken refreshToken)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.RefreshTokens.Add(refreshToken);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (RefreshTokenExists(refreshToken.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = refreshToken.Id }, refreshToken);
        }

        // DELETE: api/RefreshTokens/5
        [ResponseType(typeof(RefreshToken))]
        [AllowAnonymous]
        [Route("")]
        public async Task<IHttpActionResult> DeleteRefreshToken(string id)
        {
            RefreshToken refreshToken = await db.RefreshTokens.FindAsync(id);
            if (refreshToken == null)
            {
                return NotFound();
            }

            db.RefreshTokens.Remove(refreshToken);
            await db.SaveChangesAsync();

            return Ok(refreshToken);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool RefreshTokenExists(string id)
        {
            return db.RefreshTokens.Count(e => e.Id == id) > 0;
        }
    }
}