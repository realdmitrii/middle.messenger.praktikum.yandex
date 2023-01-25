import { registerComponent } from 'core/registerComponent';
import { renderDOM } from 'core/renderDOM';

import { ChatBox } from 'components/chat-box/ChatBox';
import { ChatCard } from 'components/chat-card/ChatCard';
import { ChatUsers } from 'components/chat-users/ChatUsers';
import { ChatsBoard } from 'components/chats-board/ChatsBoard';
import { Form } from 'components/form/Form';
import { MessageBox } from 'components/message-box/MessageBox';
import { Modal } from 'components/modal/Modal';
import { PostBoard } from 'components/post-board/PostBoard';
import { Avatar } from 'components/ui/avatar/Avatar';
import { Button } from 'components/ui/button/Button';
import { Input } from 'components/ui/input/Input';
import { Link } from 'components/ui/link/Link';
import { Block } from 'core/Block';

export interface BlockClass extends Function {
  new (props: any): Block;
  componentName?: string;
}

export async function renderBlock(Block: BlockClass, props: any) {
  registerComponent(ChatBox);
  registerComponent(ChatCard);
  registerComponent(ChatUsers);
  registerComponent(ChatsBoard);
  registerComponent(Form);
  registerComponent(MessageBox);
  registerComponent(Modal);
  registerComponent(PostBoard);
  registerComponent(Avatar);
  registerComponent(Button);
  registerComponent(Input);
  registerComponent(Link);

  document.body.innerHTML = '<div id="app"></div>';

  renderDOM(new Block({ ...props }));
}

export async function step(_name: string, callback: () => void) {
  await callback();
}
