import { Component, inject, OnInit } from '@angular/core';
import { User } from 'stream-chat';
import {
  ChatClientService,
  ChannelService,
  StreamI18nService,
  StreamAutocompleteTextareaModule,
  StreamChatModule,
} from 'stream-chat-angular';
import { UserService } from '../user.service';

@Component({
  selector: 'app-messenger-page',
  standalone: true,
  imports: [StreamAutocompleteTextareaModule, StreamChatModule],
  templateUrl: './messenger-page.component.html',
  styleUrls: ['./messenger-page.component.css'],
})
export class MessengerPageComponent implements OnInit {
  user = inject(UserService);

  constructor(
    private chatService: ChatClientService,
    private channelService: ChannelService,
    private streamI18nService: StreamI18nService,
  ) {
    
    
  }

  async getKey(): Promise<string> {
    const token = await this.user.getStreamKey();
    if (!token) {
      throw new Error('User token is missing');
    }
    return token;
  }


  async getUid(): Promise<string> {
    const uid = await this.user.getUid();
    if (!uid) {
      throw new Error('Uid is missing');
    }
    return uid;
  }

  async getImage(): Promise<string> {
    const imageUrl = await this.user.getImageURL();
    if (!imageUrl) {
      throw new Error('Image is missing');
    }
    return imageUrl;
  }


  

  async ngOnInit() {
    const token = await this.getKey();
    const uid = await this.getUid();
    const UserimageUrl = await this.getImage();
    const apiKey = '25tf5sakkgnx';
    const userId = uid;
    const userToken = token;
    console.log(token);
    const userName = 'lucky';

    const user: User = {
      id: userId,
      name: userName,
      image: UserimageUrl,
    };

    this.chatService.init(apiKey, user, userToken);
    this.streamI18nService.setTranslation();


    

    const matches = ['john', 'bobby', 'tod'];

    for (const match of matches) {
      const channel = this.chatService.chatClient.channel('messaging', {
        members: [uid, match],
        name: `Chat with ${match}`,
      });
    
      // Force channel creation
      try {
        await channel.create();
        await channel.watch(); // Optional, for real-time updates
        console.log(`Created channel with ${match}`);
      } catch (error) {
        console.error(`Failed to create channel with ${match}`, error);
      }
    }
    
    

    this.channelService.init({
      type: 'messaging',
      members: { $in: [uid]},
    });



    // this.channelService.init({
    //   type: 'messaging',
    //   members: { $in: [uid] },
    // });
    
    
  }

  }
  

