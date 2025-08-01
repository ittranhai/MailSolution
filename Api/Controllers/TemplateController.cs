using MailSolution.Api.Models;
using MailSolution.Api.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text;
namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class TemplateController : ControllerBase
{

    public TemplateController()
    {

    }

    [AllowAnonymous]
    [HttpPost]
    public IActionResult Create([FromBody] CreateTemplateModel model)
    {
        string fileView = $"Views/{model.TemplateName}.cshtml";
        string fileModel = $"MailModels/{model.TemplateName}.txt";
        try
        {
            if (!Directory.Exists(GetPathCombine("Views")) && !Directory.Exists(GetPathCombine("MailModels")))
            {
                Directory.CreateDirectory(GetPathCombine("Views"));
                Directory.CreateDirectory(GetPathCombine("MailModels"));
            }
            
            // Save the a file to views folder
            System.IO.File.WriteAllText(GetPathCombine(fileView), model.Content, Encoding.UTF8);
            // Save the a file to views MailModels
            System.IO.File.WriteAllText(GetPathCombine(fileModel), model.JsonModel, Encoding.UTF8);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

    }
    [AllowAnonymous]
    [HttpGet]
    public IActionResult GetAllTemplate()
    {
        string folderModels = @"MailModels";
        string folderView = @"Views";
        if (Directory.Exists(GetPathCombine(folderModels)) && Directory.Exists(GetPathCombine(folderView)))
        {
            string[] files = Directory.GetFiles(GetPathCombine(folderModels));
            List<TemplateModel> templates = new List<TemplateModel>();

            foreach (string filePath in files)
            {
                string fileName = Path.GetFileName(filePath);
                fileName = fileName.Replace(".txt", "");
                var tempalte = new TemplateModel
                {
                    TemplateName = fileName,
                    JsonModel = System.IO.File.ReadAllText(GetPathCombine(folderModels+"/"+fileName+".txt"), Encoding.UTF8),
                    Content = System.IO.File.ReadAllText(GetPathCombine(folderView+"/"+fileName+".cshtml"), Encoding.UTF8)
                };
                templates.Add(tempalte);
            }
            return Ok(templates);
        }
        else
        {
            return Ok(new List<string>());
        }
    }
    private string GetPathCombine(string path)
    {
        return Path.Combine(AppDomain.CurrentDomain.BaseDirectory, path);
    }
}
