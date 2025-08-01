namespace MailSolution.Api.Models;

public class TemplateModel
{
    public required string TemplateName { get; set; }
    public required string Content { get; set; }
    public required string JsonModel { get; set; }
}
public class CreateTemplateModel
{
    public required string TemplateName { get; set; }
    public required string Content { get; set; }
    public required string JsonModel { get; set; }
}
