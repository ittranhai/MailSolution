namespace MailSolution.Api.Models;

public class MailModel
{
    public required string ToEmail { get; set; }
    public required string Subject { get; set; }
    public required string Body { get; set; }
    public List<IFormFile>? Attachments { get; set; }
}
public class SendMailModel
{
    public required string ToEmail { get; set; }
    public required string Subject { get; set; }
    public required string TemplateName { get; set; }
    public required string JsonBody { get; set; }
}
