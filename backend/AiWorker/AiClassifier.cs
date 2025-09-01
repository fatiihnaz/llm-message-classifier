using OpenAI.Chat;
using System.Text.Json;

namespace AiWorker;

public sealed class AiClassifier
{
  private readonly ChatClient _chat;

  public AiClassifier(ChatClient chat)
  {
    _chat = chat;
  }

  public async Task<(string Category, string Urgency, string SuggestedReply)> ClassifyAsync(string message, CancellationToken ct = default)
  {
    var options = new ChatCompletionOptions
    {
      ResponseFormat = ChatResponseFormat.CreateJsonObjectFormat(),
      Temperature = 0
    };

    var chatMessages = new List<ChatMessage> {
       new SystemChatMessage("Mesajı analiz et ve sadece şu JSON formatında yanıt ver: " +
                              "{\"Category\": \"Kargo Takip|Kargo Yönetimi|Ödeme Sorunu|Genel Memnuniyet\", " +
                              "\"Urgency\": \"Düşük|Orta|Yüksek\", " +
                              "\"SuggestedReply\": \"Türkçe kısa kibar yanıt\"}"),
        new UserChatMessage(message)
    };

    try 
    {
      var completion = await _chat.CompleteChatAsync(chatMessages, options, ct);
      var json = completion.Value.Content[0].Text;

      using var doc = JsonDocument.Parse(json);
      var root = doc.RootElement;

      return (
        root.GetProperty("Category").GetString()!,
        root.GetProperty("Urgency").GetString()!,
        root.GetProperty("SuggestedReply").GetString()!
      );
    }
    catch (System.ClientModel.ClientResultException ex)
    {
      // API hatası detayları
      throw new InvalidOperationException($"Groq API hatası: {ex.Message}", ex);
    }
    catch (JsonException ex)
    {
      // JSON parse hatası
      throw new InvalidOperationException($"AI yanıtı JSON formatında değil: {ex.Message}", ex);
    }
  }
}
