import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  isOpen = signal(false);
  messages = signal<Message[]>([
    {
      text: '¡Hola! ¿En qué puedo ayudarte hoy?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  newMessage = '';
  isTyping = signal(false);

  toggleChat() {
    this.isOpen.update(value => !value);
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    // Agregar mensaje de usuario
    this.messages.update(msgs => [
      ...msgs,
      {
        text: this.newMessage,
        isBot: false,
        timestamp: new Date()
      }
    ]);

    const userMessage = this.newMessage.toLowerCase();
    this.newMessage = '';

    // Simular la escritura de un bot
    this.isTyping.set(true);

    // Simular la respuesta del bot después de un retraso
    setTimeout(() => {
      this.isTyping.set(false);
      const botResponse = this.getBotResponse(userMessage);
      this.messages.update(msgs => [
        ...msgs,
        {
          text: botResponse,
          isBot: true,
          timestamp: new Date()
        }
      ]);
    }, 1000);
  }

  private getBotResponse(message: string): string {
    // Lógica de respuesta simple: puedes ampliarla o integrarla con una API real
    if (message.includes('hola') || message.includes('hi')) {
      return '¡Hola! ¿Cómo puedo ayudarte hoy?';
    } else if (message.includes('producto') || message.includes('products')) {
      return 'Puedes ver todos nuestros productos en la página principal. ¿Buscas algo en particular?';
    } else if (message.includes('precio') || message.includes('price')) {
      return 'Los precios de nuestros productos varían. ¿Te gustaría información sobre algún producto específico?';
    } else if (message.includes('envío') || message.includes('shipping')) {
      return 'Ofrecemos envío gratis en compras mayores a $50. El tiempo de entrega es de 3-5 días hábiles.';
    } else if (message.includes('pago') || message.includes('payment')) {
      return 'Aceptamos todas las tarjetas de crédito y débito principales. El pago es 100% seguro.';
    } else if (message.includes('ayuda') || message.includes('help')) {
      return 'Estoy aquí para ayudarte con información sobre productos, precios, envíos y pagos. ¿Qué necesitas saber?';
    } else if (message.includes('gracias') || message.includes('thanks')) {
      return '¡De nada! ¿Hay algo más en lo que pueda ayudarte?';
    } else {
      return 'Gracias por tu mensaje. ¿Puedes darme más detalles sobre lo que necesitas? Puedo ayudarte con productos, precios, envíos y métodos de pago.';
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
