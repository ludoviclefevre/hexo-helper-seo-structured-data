'use strict';
module.exports = getStructuredData;

var Promise = require('bluebird'),
  fs = Promise.promisifyAll(require('fs')),
  ejs = require('ejs'),
  path = require('path'),
  viewPath = path.join(__dirname, '..', 'views');

function getStructuredData(config) {
  return Promise.join(
    getWebsiteStructuredData(config),
    getOrganizationStructuredData(config),
    concatenateContent);
}

function getWebsiteStructuredData(config) {
  var templateFilePath = path.join(viewPath, 'website.ejs');
  var data = {
    'name': config.title,
    'url': config.url
  };
  return Promise.join(
    templateFilePath,
    getTemplateContent(templateFilePath),
    data,
    getCompiledContent
  );
}

function getOrganizationStructuredData(config) {
  var templateFilePath = path.join(viewPath, 'organization.ejs');
  var data = {
    'name': config.seo_structured_data.organization.name,
    'url': config.seo_structured_data.organization.url,
    'logoUrl': config.seo_structured_data.organization.logoUrl
  };
  return Promise.join(
    templateFilePath,
    getTemplateContent(templateFilePath),
    data,
    getCompiledContent
  );
}

function getTemplateContent(filePath) {
  return fs.readFileAsync(filePath, {encoding: 'utf8'});
}

function getCompiledContent(templateFilePath, templateContent, data) {
  var compiledTemplate = ejs.compile(templateContent, {
    filename: templateFilePath
  });
  return compiledTemplate(data);
}

function concatenateContent(website, organization) {
  return website + '\n' + organization;
}
