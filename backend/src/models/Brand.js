import mongoose from 'mongoose';
import slugify from 'slugify';

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide brand name'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      default: '',
    },
    logo: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

brandSchema.index({ slug: 1 });
brandSchema.index({ isActive: 1 });

brandSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const Brand = mongoose.model('Brand', brandSchema);

export default Brand;
