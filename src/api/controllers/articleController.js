import cloudinary from 'cloudinary';
import models from '../models';
import statusCodes from '../../helpers/constants/status.codes';
import errorMessage from '../../helpers/constants/error.messages';
import articleValidator from '../../helpers/validators/articleValidator';

const { Article, Category } = models;
const { CREATED } = statusCodes;

/**
 *
 *
 * this is the article controller
 *
 * @export
 * @class ArticleController
 */

/**
 * containing all article's model controllers
 * @export
 * @class ArticleController
 */
export default class ArticleController {
  /**
   * register a new
   * @static
   * @param {*} req the request
   * @param {*} res the response to be sent
   * @memberof ArticleController
   * @returns {Object} res
   */
  static async create(req, res) {
    const { id: author } = req.user.user;

    const articleValidInput = await articleValidator(req.body);
    const { category: id } = req.body;
    let coverImage;
    if (req.file) {
      const savedFile = await cloudinary.v2.uploader.upload(req.file.path);
      coverImage = savedFile.secure_url;
    }
    const getCategory = await Category.findOne({ where: { id } });
    const { id: category } = getCategory.dataValues;
    const article = await Article.create({
      ...articleValidInput,
      slug: '',
      author,
      category,
      coverImage
    });
    if (article) {
      return res.status(CREATED).json({
        message: errorMessage.articleCreate,
        article: article.get()
      });
    }
  }

  /**
   *
   *
   * @static
   * @param {Object} req - request object
   * @param {Object} res - respond object
   * @returns {Object} response body
   * @memberof ArticleController
   */
  static async delete(req, res) {
    const { slug } = req.params;
    await Article.destroy({ where: { slug } });
    res.status(statusCodes.OK).json({
      statusCodes: res.statusCodes,
      message: 'article deleted successfully'
    });
  }

  /**
   * allow an author to update his/her article
   *
   * @static
   * @param {object} req the request
   * @param {object} res the response to be sent
   * @memberof ArticleController
   * @returns {Object} res
   */
  static async updateArticle(req, res) {
    const { slug } = req.params;
    const {
      title, description, body, tagList, category
    } = req.body;

    let { coverImage } = req.Existing;

    if (req.file) {
      const image = await cloudinary.v2.uploader.upload(req.file.path);
      coverImage = image.secure_url;
    }
    const updateContent = {
      title: title || req.Existing.title,
      description: description || req.Existing.description,
      body: body || req.Existing.body,
      tagList: tagList || req.Existing.tagList,
      category: category || req.Existing.category
    };

    await Article.update({
      title: updateContent.title,
      description: updateContent.description,
      body: updateContent.body,
      coverImage,
      category: updateContent.category
    },
    {
      where: {
        slug
      }
    });
    return res.status(statusCodes.OK).json({
      status: statusCodes.OK,
      message: 'Your Article is up-to-date now, Thanks'
    });
  }
}
