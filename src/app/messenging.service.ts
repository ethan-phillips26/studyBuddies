import { Injectable } from '@angular/core';
import {
  ChatClientService,
  ChannelService,
  StreamI18nService,
} from 'stream-chat-angular';

export interface Match {
  name: string;
  interest: string;
}

@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  constructor(
    private chatService: ChatClientService,
    private channelService: ChannelService,
    private streamI18nService: StreamI18nService
  ) {}

   apiKey: string = '25tf5sakkgnx';

  initChat(user: string, user2: string, name1: string, name2: string, userToken: string) {
    this.chatService.init(this.apiKey, user, userToken);

    this.streamI18nService.setTranslation();

    this.createChannel(user, user2, name1, name2);
  }

  async createChannel(uid: string, uid2: string, name1: string, name2: string) {
    const channel = this.chatService.chatClient.channel('messaging', uid + uid2 + '', {
      members: [uid, uid2],
      name: name1 + ' and ' + name2,
    });

    try {
      await channel.create();
      await channel.watch();
    } catch (error) {
      console.error(error);
    }
  }

  async deleteChannel(channelId: string): Promise<void> {
    try {
      const channel = this.chatService.chatClient.channel('messaging', channelId);
      await channel.delete();
    } catch (error) {
      console.error(error);
    }
  }
}
