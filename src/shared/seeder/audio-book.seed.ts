import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AudioBook } from '@/audio-book/entities/audio-book.entity';
import { AudioBookService } from '@/audio-book/audio-book.service';

const data = [
  {
    title: 'Downtown',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/70.jpg',
    desc: 'Ergonomic executive chair upholstered in bonded black leather and PVC padded seat and back for all-day comfort and support',
    publishDate: 18,
    id: '1',
  },
  {
    title: 'Downtown',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/533.jpg',
    desc: 'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
    publishDate: 68,
    id: '2',
  },
  {
    title: 'Stand By Me',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/427.jpg',
    desc: 'The Football Is Good For Training And Recreational Purposes',
    publishDate: 92,
    id: '3',
  },
  {
    title: 'Harbour Lights',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/358.jpg',
    desc: 'New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016',
    publishDate: 34,
    id: '4',
  },
  {
    title: 'Believe',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/213.jpg',
    desc: 'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
    publishDate: 28,
    id: '5',
  },
  {
    title: 'Lady Marmalade (Voulez-Vous Coucher Aver Moi Ce Soir?)',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/715.jpg',
    desc: "Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
    publishDate: 2,
    id: '6',
  },
  {
    title: 'Bad',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/646.jpg',
    desc: 'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
    publishDate: 94,
    id: '7',
  },
  {
    title: 'Best of My Love',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/262.jpg',
    desc: 'The Football Is Good For Training And Recreational Purposes',
    publishDate: 11,
    id: '8',
  },
  {
    title: 'Always On My Mind',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/240.jpg',
    desc: 'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality',
    publishDate: 100,
    id: '9',
  },
  {
    title: "Ain't No Mountain High Enough",
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/912.jpg',
    desc: 'The Football Is Good For Training And Recreational Purposes',
    publishDate: 8,
    id: '10',
  },
  {
    title: 'Wind Beneath My Wings',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/469.jpg',
    desc: 'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive',
    publishDate: 5,
    id: '11',
  },
  {
    title: 'Kiss You All Over',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/906.jpg',
    desc: "Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
    publishDate: 27,
    id: '12',
  },
  {
    title: 'Paper Doll',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/27.jpg',
    desc: 'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive',
    publishDate: 31,
    id: '13',
  },
  {
    title: 'White Christmas',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/46.jpg',
    desc: 'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive',
    publishDate: 10,
    id: '14',
  },
  {
    title: 'Green Tambourine',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1229.jpg',
    desc: 'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive',
    publishDate: 41,
    id: '15',
  },
  {
    title: 'Hang On Sloopy',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/464.jpg',
    desc: 'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive',
    publishDate: 79,
    id: '16',
  },
  {
    title: 'Red Red Wine',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1245.jpg',
    desc: 'New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016',
    publishDate: 77,
    id: '17',
  },
  {
    title: 'Swanee',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/593.jpg',
    desc: "Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
    publishDate: 86,
    id: '18',
  },
  {
    title: 'Da Doo Ron Ron (When He Walked Me Home)',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/5.jpg',
    desc: 'Carbonite web goalkeeper gloves are ergonomically designed to give easy fit',
    publishDate: 23,
    id: '19',
  },
  {
    title: 'Long Cool Woman in a Black Dress',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/690.jpg',
    desc: "Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
    publishDate: 13,
    id: '20',
  },
  {
    title: 'Check On It',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/586.jpg',
    desc: 'The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients',
    publishDate: 2,
    id: '21',
  },
  {
    title: 'Running Scared',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/185.jpg',
    desc: 'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
    publishDate: 8,
    id: '22',
  },
  {
    title: 'White Christmas',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1202.jpg',
    desc: "Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
    publishDate: 76,
    id: '23',
  },
  {
    title: 'We Are the World',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/719.jpg',
    desc: 'Andy shoes are designed to keeping in mind durability as well as trends, the most stylish range of shoes & sandals',
    publishDate: 98,
    id: '24',
  },
  {
    title: 'Knock Three Times',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/694.jpg',
    desc: 'Ergonomic executive chair upholstered in bonded black leather and PVC padded seat and back for all-day comfort and support',
    publishDate: 48,
    id: '25',
  },
  {
    title: 'Cherish',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1194.jpg',
    desc: "Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
    publishDate: 2,
    id: '26',
  },
  {
    title: 'Incense & Peppermints',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/201.jpg',
    desc: 'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
    publishDate: 7,
    id: '27',
  },
  {
    title: 'Only The Lonely (Know The Way I Feel)',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/621.jpg',
    desc: 'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
    publishDate: 13,
    id: '28',
  },
  {
    title: '(Ghost) Riders in the Sky',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/162.jpg',
    desc: 'New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016',
    publishDate: 94,
    id: '29',
  },
  {
    title: 'Toxic',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/794.jpg',
    desc: 'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
    publishDate: 90,
    id: '30',
  },
  {
    title: 'This Land is Your Land',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/227.jpg',
    desc: 'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive',
    publishDate: 35,
    id: '31',
  },
  {
    title: 'Locked Out Of Heaven',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/303.jpg',
    desc: 'The Football Is Good For Training And Recreational Purposes',
    publishDate: 59,
    id: '32',
  },
  {
    title: 'Three Times a Lady',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1027.jpg',
    desc: 'The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients',
    publishDate: 62,
    id: '33',
  },
  {
    title: 'Eve of Destruction',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/336.jpg',
    desc: 'The Football Is Good For Training And Recreational Purposes',
    publishDate: 35,
    id: '34',
  },
  {
    title: 'My Girl',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1054.jpg',
    desc: 'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
    publishDate: 12,
    id: '35',
  },
  {
    title: 'Keep On Loving You',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/706.jpg',
    desc: 'New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016',
    publishDate: 11,
    id: '36',
  },
  {
    title: 'Wake Up Little Susie',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/348.jpg',
    desc: 'Carbonite web goalkeeper gloves are ergonomically designed to give easy fit',
    publishDate: 41,
    id: '37',
  },
  {
    title: 'My Sharona',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/397.jpg',
    desc: 'The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients',
    publishDate: 39,
    id: '38',
  },
  {
    title: 'A Thousand Miles',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/488.jpg',
    desc: 'New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016',
    publishDate: 33,
    id: '39',
  },
  {
    title: 'Wild Thing',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/345.jpg',
    desc: 'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive',
    publishDate: 49,
    id: '40',
  },
  {
    title: 'Sailing',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/500.jpg',
    desc: 'Ergonomic executive chair upholstered in bonded black leather and PVC padded seat and back for all-day comfort and support',
    publishDate: 2,
    id: '41',
  },
  {
    title: "It's My Party",
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/41.jpg',
    desc: 'Andy shoes are designed to keeping in mind durability as well as trends, the most stylish range of shoes & sandals',
    publishDate: 40,
    id: '42',
  },
  {
    title: 'Downtown',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/64.jpg',
    desc: 'The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients',
    publishDate: 45,
    id: '43',
  },
  {
    title: 'Man in the Mirror',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/846.jpg',
    desc: 'The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients',
    publishDate: 62,
    id: '44',
  },
  {
    title: "A Whole New World (Aladdin's Theme)",
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1210.jpg',
    desc: "Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
    publishDate: 9,
    id: '45',
  },
  {
    title: 'A Thousand Miles',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1057.jpg',
    desc: 'Ergonomic executive chair upholstered in bonded black leather and PVC padded seat and back for all-day comfort and support',
    publishDate: 34,
    id: '46',
  },
  {
    title: 'Ring My Bell',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/726.jpg',
    desc: 'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
    publishDate: 6,
    id: '47',
  },
  {
    title: 'Great Balls of Fire',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1245.jpg',
    desc: 'Carbonite web goalkeeper gloves are ergonomically designed to give easy fit',
    publishDate: 28,
    id: '48',
  },
  {
    title: 'Boogie Woogie Bugle Boy',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1212.jpg',
    desc: 'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
    publishDate: 51,
    id: '49',
  },
  {
    title: 'Band On the Run',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/800.jpg',
    desc: 'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive',
    publishDate: 54,
    id: '50',
  },
  {
    title: 'Black Velvet',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1097.jpg',
    desc: 'The Football Is Good For Training And Recreational Purposes',
    publishDate: 20,
    id: '51',
  },
  {
    title: "School's Out",
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/977.jpg',
    desc: 'The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients',
    publishDate: 59,
    id: '52',
  },
  {
    title: 'One of Us',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/953.jpg',
    desc: 'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
    publishDate: 45,
    id: '53',
  },
  {
    title: "Groovin'",
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1037.jpg',
    desc: 'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
    publishDate: 42,
    id: '54',
  },
  {
    title: 'The Love You Save',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/737.jpg',
    desc: 'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
    publishDate: 77,
    id: '55',
  },
  {
    title: 'Here in My Heart',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/84.jpg',
    desc: "Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
    publishDate: 57,
    id: '56',
  },
  {
    title: 'Sh-Boom (Life Could Be a Dream)',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/298.jpg',
    desc: 'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive',
    publishDate: 55,
    id: '57',
  },
  {
    title: "I'm So Lonesome I Could Cry",
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/227.jpg',
    desc: 'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
    publishDate: 47,
    id: '58',
  },
  {
    title: 'Beautiful Day',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/32.jpg',
    desc: 'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
    publishDate: 97,
    id: '59',
  },
  {
    title: "Cracklin' Rosie",
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1183.jpg',
    desc: 'The Football Is Good For Training And Recreational Purposes',
    publishDate: 62,
    id: '60',
  },
  {
    title: 'Lean On Me',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/241.jpg',
    desc: 'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality',
    publishDate: 87,
    id: '61',
  },
  {
    title: 'At the Hop',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1143.jpg',
    desc: 'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive',
    publishDate: 22,
    id: '62',
  },
  {
    title: 'The Way You Move',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/126.jpg',
    desc: 'Andy shoes are designed to keeping in mind durability as well as trends, the most stylish range of shoes & sandals',
    publishDate: 44,
    id: '63',
  },
  {
    title: 'I Believe I Can Fly',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/584.jpg',
    desc: 'New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016',
    publishDate: 67,
    id: '64',
  },
  {
    title: 'Spill the Wine',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/204.jpg',
    desc: 'The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients',
    publishDate: 70,
    id: '65',
  },
  {
    title: "Don't Leave Me This Way",
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/421.jpg',
    desc: 'New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016',
    publishDate: 100,
    id: '66',
  },
  {
    title: "Little Darlin'",
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/529.jpg',
    desc: 'The Football Is Good For Training And Recreational Purposes',
    publishDate: 18,
    id: '67',
  },
  {
    title: 'The First Time Ever I Saw Your Face',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/102.jpg',
    desc: 'Carbonite web goalkeeper gloves are ergonomically designed to give easy fit',
    publishDate: 47,
    id: '68',
  },
  {
    title: 'Stuck On You',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/704.jpg',
    desc: 'The Football Is Good For Training And Recreational Purposes',
    publishDate: 71,
    id: '69',
  },
  {
    title: 'My Blue Heaven',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/356.jpg',
    desc: 'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
    publishDate: 28,
    id: '70',
  },
  {
    title: 'Dancing in the Street',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/824.jpg',
    desc: 'The Football Is Good For Training And Recreational Purposes',
    publishDate: 27,
    id: '71',
  },
  {
    title: 'Proud Mary',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/539.jpg',
    desc: "Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
    publishDate: 79,
    id: '72',
  },
  {
    title: 'The Letter',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/585.jpg',
    desc: 'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
    publishDate: 94,
    id: '73',
  },
  {
    title: 'Glamorous',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/201.jpg',
    desc: 'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
    publishDate: 43,
    id: '74',
  },
  {
    title: 'Cherish',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1135.jpg',
    desc: 'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
    publishDate: 38,
    id: '75',
  },
  {
    title: "Stormy Weather (Keeps Rainin' All the Time)",
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/437.jpg',
    desc: 'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
    publishDate: 31,
    id: '76',
  },
  {
    title: 'This Love',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/278.jpg',
    desc: 'The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients',
    publishDate: 24,
    id: '77',
  },
  {
    title: 'Harper Valley PTA',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/156.jpg',
    desc: 'Ergonomic executive chair upholstered in bonded black leather and PVC padded seat and back for all-day comfort and support',
    publishDate: 92,
    id: '78',
  },
  {
    title: 'Leaving',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1132.jpg',
    desc: 'The Football Is Good For Training And Recreational Purposes',
    publishDate: 97,
    id: '79',
  },
  {
    title: 'Got to Give it Up',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1168.jpg',
    desc: "Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
    publishDate: 32,
    id: '80',
  },
  {
    title: 'Vision of Love',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/549.jpg',
    desc: 'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality',
    publishDate: 33,
    id: '81',
  },
  {
    title: 'Baby Come Back',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/275.jpg',
    desc: 'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
    publishDate: 28,
    id: '82',
  },
  {
    title: 'Girls Just Wanna Have Fun',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/143.jpg',
    desc: 'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
    publishDate: 24,
    id: '83',
  },
  {
    title: 'Ruby Tuesday',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/175.jpg',
    desc: 'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
    publishDate: 39,
    id: '84',
  },
  {
    title: 'I Need You Now',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/186.jpg',
    desc: 'The Football Is Good For Training And Recreational Purposes',
    publishDate: 15,
    id: '85',
  },
  {
    title: 'You make Me Wanna',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1185.jpg',
    desc: 'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
    publishDate: 15,
    id: '86',
  },
  {
    title: 'I Want You Back',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1088.jpg',
    desc: 'The Football Is Good For Training And Recreational Purposes',
    publishDate: 45,
    id: '87',
  },
  {
    title: 'Streets of Philadelphia',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/381.jpg',
    desc: 'The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients',
    publishDate: 33,
    id: '88',
  },
  {
    title: 'I Only Have Eyes For You',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/305.jpg',
    desc: 'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive',
    publishDate: 66,
    id: '89',
  },
  {
    title: 'I Only Have Eyes For You',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/944.jpg',
    desc: 'The Football Is Good For Training And Recreational Purposes',
    publishDate: 81,
    id: '90',
  },
  {
    title: 'Dancing Queen',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1036.jpg',
    desc: "Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
    publishDate: 16,
    id: '91',
  },
  {
    title: 'We Belong Together',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/428.jpg',
    desc: 'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality',
    publishDate: 35,
    id: '92',
  },
  {
    title: 'Manana (Is Soon Enough For Me)',
    image:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/944.jpg',
    desc: 'The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients',
    publishDate: 56,
    id: '93',
  },
];
@Injectable()
export class AudioBookSeed {
  constructor(
    @InjectRepository(AudioBook)
    protected readonly repository: Repository<AudioBook>,
    private readonly audioBookService: AudioBookService,
  ) {}

  async seed() {
    const count = await this.repository.count();
    if (!count) {
      for (const audio of data) {
        const { id, ...rest } = audio;
        await this.repository.save(rest);
      }
    }
  }
}
