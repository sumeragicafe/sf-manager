export interface MediaProps {
  id: string; // uuid
  fileName: string;
  mimeType: string;
  data: Buffer;
  uploadDate: Date;
}

export class Media {
  constructor(public props: MediaProps) {
    if (!props.fileName) throw new Error("Nome da mídia é obrigatório");
  }

  static createNew(fileName: string, mimeType: string, data: Buffer): Media {
    return new Media({
      id: crypto.randomUUID(),
      fileName,
      mimeType,
      data,
      uploadDate: new Date(),
    });
  }

  toPersistence(): Record<string, any> {
    return {
      id: this.props.id,
      file_name: this.props.fileName,
      mime_type: this.props.mimeType,
      data: this.props.data,
      upload_date: this.props.uploadDate,
    };
  }
}
