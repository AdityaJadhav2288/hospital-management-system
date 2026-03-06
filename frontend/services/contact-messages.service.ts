import { apiClient } from "@/services/api-client";
import type { ContactMessage } from "@/types/contact-message";

interface ContactMessagePayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export const contactMessagesService = {
  submit: async (payload: ContactMessagePayload): Promise<ContactMessage> =>
    apiClient.post<ContactMessage>("/public/contact-messages", payload, { auth: false }),

  list: async (): Promise<ContactMessage[]> => apiClient.get<ContactMessage[]>("/admin/contact-messages"),
};
