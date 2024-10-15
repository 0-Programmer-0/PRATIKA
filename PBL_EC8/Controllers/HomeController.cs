﻿using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Pbl_EC8.Models;
using PBL_EC8.Bll;

namespace PBL_EC8.Controllers;

/*[ApiController]
[Route("api/[controller]")]*/
public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }

    public IActionResult Menu()
    {
        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [HttpGet]
    public JsonResult VerificaUsuario(string login, string senha)
    {
        string teste = new UsuarioBll().VerificaUsuario(login, senha);
        return Json(new { retorno = teste });
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }

    /*[HttpGet("{userId}")]
    public ActionResult<User> GetUser(int userId)
    {
        // Simular dados do usuário
        var user = new User
        {
            Id = userId,
            Name = "João Silva",
            Email = "joao.silva@example.com"
        };

        return Ok(user);
    }*/
}
