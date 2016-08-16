'use strict';
module.exports = getStructuredData;

var fs = require('fs'),
  ejs = require('ejs'),
  path = require('path'),
  viewPath = path.join(__dirname, '..', 'views');

function getStructuredData(config) {
  var website = getWebsiteStructuredData(config);
  var organization = getOrganizationStructuredData(config);
  return website + '\n' + organization;
}

function getWebsiteStructuredData(config) {
  var templateFilePath = path.join(viewPath, 'website.ejs');
  var data = {
    'name': config.title,
    'url': config.url
  };

  var templateContent = getTemplateContent(templateFilePath);
  return getCompiledContent(templateFilePath, templateContent, data);
}

function getOrganizationStructuredData(config) {
  var templateFilePath = path.join(viewPath, 'organization.ejs');
  var data = {
    'name': config.seo_structured_data.organization.name,
    'url': config.seo_structured_data.organization.url,
    'logoUrl': config.seo_structured_data.organization.logoUrl
  };
  var templateContent =     getTemplateContent(templateFilePath);
  return getCompiledContent(templateFilePath, templateContent, data);
}

function getTemplateContent(filePath) {
  return fs.readFileSync(filePath, {encoding: 'utf8'});
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
