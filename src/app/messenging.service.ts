import { inject, Injectable } from '@angular/core';
import {
  ChatClientService,
  ChannelService,
  StreamI18nService,
} from 'stream-chat-angular';
import { firstValueFrom } from 'rxjs';
import { UserService } from './user.service';

export interface Match {
  name: string;
  interest: string;
}



@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  streamKey: string = '';
  constructor(
    private chatService: ChatClientService,
    private channelService: ChannelService,
    private streamI18nService: StreamI18nService
  ) {}

   apiKey: string = '25tf5sakkgnx';
   user = inject(UserService);

  initChat(user: string, user2: string, name1: string, name2: string, userToken: string) {
    this.chatService.init(this.apiKey, user, userToken);

    this.streamI18nService.setTranslation();

    this.createChannel(user, user2, name1, name2);
  }

  async initChatClient() {
    const streamKey = await this.user.getStreamKey();
    this.chatService.init(this.apiKey, this.user.getUid(), streamKey);
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

  async createGroupChannel(uid: string, name: string, date:string) {

    await this.initChatClient();
    const client = this.chatService.chatClient;

    if (!client) {
      console.error('Chat client is not initialized!');
      return;
    }

    const channel = client.channel('messaging', (name + date).replace(/\s+/g, ''), {
      members: [uid],
      name: name,
    });

    try {
      await channel.create();
      await channel.watch();
    } catch (error) {
      console.error('Error creating group channel:', error);
    }
  }

  async addGroupChannelMember(uidUser: string, channelId: string) {
    const channel = this.chatService.chatClient.channel('messaging', channelId);
    await channel.addMembers([uidUser]);
  }

  async deleteChannel(channelId: string): Promise<void> {
    try {
      const channel = this.chatService.chatClient.channel('messaging', channelId.replace(/\s+/g, ''));
      await channel.delete();
    } catch (error) {
      console.error(error);
    }
  }

  async removeGroupChannelMember(userId: string, channelId: string) {
    const channel = this.chatService.chatClient.channel('messaging', channelId);
    await channel.removeMembers([userId]);
  }
  
}
