import "./users-board.css";
import template from "./users-board.hbs";
import { Block } from "../../core/Block";
import { renderDOM } from "../../core/renderDOM";
import { ProfilePage } from "../../pages/profile/profile";
import ownerData from "../../data/owner.json";
import usersData from "../../data/users.json";

interface Props {
  imgSrc?: string;
  displayName: string;
}

export class UsersBoard extends Block {
  constructor(props: Props) {
    super({ ...props });
  }

  render() {
    return this.compile(template, {
      imgSrc: ownerData["imgSrc"],
      displayName: ownerData["displayName"],
      usersData: usersData,
      goToProfilePage: () => {
        renderDOM(new ProfilePage());
      }
    });
  }
}
