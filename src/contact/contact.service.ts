import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from 'src/schemas/contact.schema';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel('Query')
    private contactModel: Model<Contact>,
  ) {}

  create(createContactDto: CreateContactDto) {
    try {
      const uContact = this.contactModel.create(createContactDto);
      return { status: 200, message: 'Querry was sent successfully!' };
    } catch (error) {
      return {
        status: 400,
        message: 'Querry was not sent!',
        error: error.message,
      };
    }
  }

  async findAll() {
    try {
      const uContacts = await this.contactModel.find().sort({createdAt: -1});
      return {
        status: 200,
        message: 'Queries retrieved successfully!',
        queries: uContacts,
      };
    } catch(error) {
      return { status: 400, message: 'Queries were not retrieved!', error };
    }
  }

  async findOne(id: string) {
    try {
      const uContact = await this.contactModel.findById(id);
      return {
        status: 200,
        message: 'Query was retrieved successfully!',
        blog: uContact,
      };
    } catch (error) {
      return {
        status: 400,
        message: 'Query was not retrieved!',
        error: error.message,
      };
    }
  }

  async remove(id: string) {
    try {
      const uContact = await this.contactModel.findByIdAndRemove(id);
      return {
        status: 200,
        message: `Query from ${uContact.name} was deleted successfully!`,
      };
    } catch (error) {
      return {
        status: 400,
        message: 'Query was not deleted!',
        error: error.message,
      };
    }
  }
}
