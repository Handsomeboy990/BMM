/**
 * Service d'envoi d'emails transactionnels via EmailJS (API REST).
 * Best-effort: si la configuration est absente, on journalise sans échouer
 * (l'inscription ne doit jamais être bloquée par l'email).
 */

const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

type SendResult = { sent: boolean };

async function sendViaEmailJS(
  templateId: string | undefined,
  templateParams: Record<string, string>,
): Promise<SendResult> {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    console.warn(
      `[EMAIL] Configuration EmailJS incomplète — email simulé vers ${templateParams.to_email}`,
    );
    return { sent: false };
  }

  try {
    const response = await fetch(EMAILJS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: privateKey,
        template_params: templateParams,
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error(`[EMAIL] Échec d'envoi (${response.status}): ${detail}`);
      return { sent: false };
    }
    return { sent: true };
  } catch (error) {
    console.error("[EMAIL] Erreur réseau lors de l'envoi:", error);
    return { sent: false };
  }
}

export const emailService = {
  /**
   * Email de bienvenue envoyé à un nouveau donneur. Ne contient jamais la
   * clé privée (générée et conservée côté navigateur uniquement).
   */
  sendDonorWelcome: (params: {
    toEmail: string;
    toName: string;
    bloodType: string;
    city: string;
    verifyUrl: string;
  }): Promise<SendResult> =>
    sendViaEmailJS(
      process.env.EMAILJS_WELCOME_TEMPLATE_ID ??
        process.env.EMAILJS_TEMPLATE_ID,
      {
        to_email: params.toEmail,
        to_name: params.toName,
        blood_type: params.bloodType,
        city: params.city,
        verify_url: params.verifyUrl,
      },
    ),
};
