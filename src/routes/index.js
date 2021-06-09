var masterRoutes = require("./master");
var nmasterRoutes = require("./nmaster");
// var homeRoutes = require("./home");
var tokoRoutes = require("./toko");
var gudangPusatRoutes = require("./gudang-pusat");
var inventoryRoutes = require("./inventory");
var laporanRoutes = require("./laporan");
var publicRoutes = require("./public");
var reportRoutes = require("./report");
var authRoutes = require("./auth");
var merchandiserRoutes = require("./merchandiser");
var nmerchandiserRoutes = require("./nmerchandiser"); 
var gpurchasingRoutes = require("./garment-purchasing");
var nsalesRoutes = require("./nsales");
var finishingRoutes = require("./finishing");
var generalInventoryRoutes = require("./general-inventory");
var designerRoutes = require("./designer");
var purchaseRoutes = require("./purchasing");
var npurchaseRoutes = require("./npurchasing");
//var masterplan = require("./masterplan");
var nmasterplan = require("./nmasterplan");
var expeditionRoutes = require('./expedition');
var accountingRoutes = require('./accounting');
var customersRoutes = require('./customers');
var generalSettingRoutes = require("./general-setting");
var bateeqshopReportRoutes = require("./bateeqshop-report");
var promotionRoutes = require("./promotion");
var garmentproductionRoutes = require("./garment-production");

export default [].concat( nmasterRoutes, publicRoutes, gudangPusatRoutes, tokoRoutes, nmerchandiserRoutes, gpurchasingRoutes, garmentproductionRoutes);


// export default [].concat(nmasterRoutes, publicRoutes, gudangPusatRoutes, laporanRoutes, reportRoutes, designerRoutes, merchandiserRoutes, finishingRoutes, generalInventoryRoutes, authRoutes, purchaseRoutes, npurchaseRoutes, nmasterplan, expeditionRoutes, accountingRoutes, customersRoutes, generalSettingRoutes, bateeqshopReportRoutes, promotionRoutes, nmerchandiserRoutes, nsalesRoutes, gpurchasingRoutes, garmentproductionRoutes);

// export default [].concat(nmasterRoutes, gudangPusatRoutes, finishingRoutes, publicRoutes );
// export default [].concat(nmasterRoutes, publicRoutes,gudangPusatRoutes, finishingRoutes, purchaseRoutes, npurchaseRoutes, nmasterplan, expeditionRoutes, accountingRoutes, customersRoutes, generalSettingRoutes, bateeqshopReportRoutes, promotionRoutes, nmerchandiserRoutes, nsalesRoutes, gpurchasingRoutes, garmentproductionRoutes);

