export interface ContactMessageProps {
  id?: string; // uuid
  subject: string;
  email: string;
  name: string;
  message: string;
  acceptPolicy: boolean;
  allowContact?: boolean;
  read?: boolean; // true for read, false for not read
  createdAt?: Date;
  updatedAt?: Date;
}

export class ContactMessage {
  constructor(public props: ContactMessageProps) {
    if (!props.subject || !props.email || !props.name || !props.message) {
      throw new Error('Assunto, e-mail, nome e mensagem são obrigatórios.');
    }
    if (!props.acceptPolicy) {
      throw new Error('Política de privacidade deve ser aceita.');
    }
    if (!this.isValidEmail(props.email)) {
      throw new Error('E-mail inválido.');
    }
  }

  static createNew(data: Omit<ContactMessageProps, 'id' | 'createdAt' | 'updatedAt' | 'read'>): ContactMessage {
    const now = new Date();
    return new ContactMessage({
      ...data,
      read: false,
      createdAt: now,
      updatedAt: now
    });
  }

  toPersistence(): Record<string, any> {
    return {
      id: this.props.id,
      subject: this.props.subject,
      email: this.props.email,
      name: this.props.name,
      message: this.props.message,
      acceptPolicy: this.props.acceptPolicy,
      allowContact: this.props.allowContact ?? false,
      read: this.props.read ?? false,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt
    };
  }

  markRead(read: boolean): void {
    this.props.read = read;
    this.props.updatedAt = new Date();
  }

  private isValidEmail(email: string): boolean {
    // Simple email validation
    return /.+@.+\..+/.test(email);
  }
}


