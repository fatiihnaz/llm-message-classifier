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
      new SystemChatMessage(
@"Görev: Kullanıcı mesajını sınıflandır ve kısa bir ilk cevap üret. SADECE şu JSON'u döndür:
{""Category"": ""Kargo Takip|Kargo Yönetimi|Ödeme Sorunu|Genel Memnuniyet"",
 ""Urgency"": ""Düşük|Orta|Yüksek"",
 ""SuggestedReply"": ""Türkçe kısa kibar yanıt""}

Kurallar (çok önemli):
- Çıktı kesinlikle tek bir JSON nesnesi olsun (öncesinde/sonrasında metin yok). Başka anahtar ekleme.
- Ton: İlk temas, kibar, yardımsever. Maksimum 2 kısa cümle.
- SuggestedReply yalnızca **kısa bir başlangıç** olsun (giriş/gerekli ilk adım). Uzun açıklama, link/telefon/emoji/markdown verme.
- Sistem, mevcutsa kargo takip numarasını zaten girdiye eklemiştir. **Takip numarası varsa tekrar isteme;** yerine onayla ve işlem başlatan bir başlangıç yaz.
- Category seçim mantığı (öncelik sırası):
  1) Kargo Yönetimi: hasar/eksik parça/kırık/ezik/ıslak, iade/değişim talebi, teslim alındı ama sorunlu.
  2) Kargo Takip: nerede/kaldı/gelmedi/teslim edilmedi/gecikti, takip/konum/ETA soruları.
  3) Ödeme Sorunu: ücret/iade, fazla çekim, kart/havale/ödeme başarısız, fatura/irsaliye.
  4) Genel Memnuniyet: teşekkür/övgü/şikayet (kargo/ödeme içermiyorsa) ve genel geri bildirim.
- Çakışırsa: hasar/eksik vb. geçiyorsa **Kargo Yönetimi**, Kargo Takip'e tercih edilir.
- Urgency:
  - Yüksek: hasarlı/eksik ürün, kayıp/yanlış teslim, acil zaman baskısı.
  - Orta: bir sorun var ama acil değil (çoğu takip/ödeme).
  - Düşük: genel memnuniyet/temel bilgi.
- SuggestedReply başlangıç kalıpları:
  - Kargo Yönetimi: ""Merhaba, yaşadığınız sorun için üzgünüz. İnceleme başlatabilmem için 2–3 fotoğraf paylaşabilir misiniz?""
  - Kargo Takip: ""Merhaba, gönderinizi kontrol ediyorum. Güncel durumu paylaşabilmem adına sizi biraz bekletebilir miyim?""
  - Ödeme Sorunu: ""Merhaba, kontrol ediyorum. Kontrol edebilmem adına sipariş numaranız ve işlem tarih/tutar bilgisini kısaca paylaşır mısınız?""
  - Genel Memnuniyet (olumlu): ""Merhaba, değerli geri bildiriminiz için teşekkür ederiz. Deneyiminizi kısaca paylaşabilirsiniz.""
  - Genel Memnuniyet (olumsuz): ""Merhaba, yaşadığınız durum için üzgünüz.""
- Türkçe sinyaller: ""hasarlı"", ""kırık"", ""ezik"", ""ıslak"", ""eksik parça"", ""nerede"", ""gelmedi"", ""teslim edilmedi"", ""gecikti"", ""iade"", ""ödeme"", ""fatura"", ""fazla çekim"", ""iptal"""),

    new SystemChatMessage(
@"Örnekler (yalnızca JSON döndürülür):

Girdi: ""Kargom hasarlı geldi, kutu ezilmiş.""
Çıktı: {""Category"": ""Kargo Yönetimi"", ""Urgency"": ""Yüksek"", ""SuggestedReply"": ""Merhaba, yaşadığınız sorun için üzgünüz. İnceleyebilmem için 2–3 fotoğraf paylaşabilir misiniz?""}

Girdi: ""Kargom nerede kaldı, 3 gündür güncellenmiyor.""
Çıktı: {""Category"": ""Kargo Takip"", ""Urgency"": ""Orta"", ""SuggestedReply"": ""Merhaba, hemen kontrol edebilmem için kargo takip veya sipariş numaranızı yazar mısınız?""}

Girdi: ""Takip no: C1234567182 - 2 gündür dağıtımda gözüküyor ama gelmedi.""
Çıktı: {""Category"": ""Kargo Takip"", ""Urgency"": ""Orta"", ""SuggestedReply"": ""Merhaba, gönderinizi kontrol ediyorum. Güncel durumu paylaşabilmem adına sizi biraz bekletebilir miyim?""} 

Girdi: ""Ürün kırık geldi, takip numaram 1Z999AA10123456784.""
Çıktı: {""Category"": ""Kargo Yönetimi"", ""Urgency"": ""Yüksek"", ""SuggestedReply"": ""Merhaba, gönderiniz için hemen inceleme başlatıyorum. İnceleyebilmem için 2–3 fotoğraf paylaşabilir misiniz?""} 

Girdi: ""Ödeme iki kere çekilmiş gözüküyor.""
Çıktı: {""Category"": ""Ödeme Sorunu"", ""Urgency"": ""Orta"", ""SuggestedReply"": ""Merhaba, kontrol ediyorum. Doğrulayabilmem için ödeme numaranız ve işlem tarih/tutar bilgisini kısaca paylaşır mısınız?""}

Girdi: ""Kurye çok nazikti, teşekkür ederim.""
Çıktı: {""Category"": ""Genel Memnuniyet"", ""Urgency"": ""Düşük"", ""SuggestedReply"": ""Merhaba, değerli geri bildiriminiz için teşekkür ederiz.""}"
    ),

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
