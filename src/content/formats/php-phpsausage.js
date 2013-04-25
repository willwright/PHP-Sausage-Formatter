var subScriptLoader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
subScriptLoader.loadSubScript('chrome://selenium-ide/content/formats/webdriver.js', this);

this.options = {
    receiver: "$this",
    showSelenese: 'false',
    namespace: "SeleniumTests",
    indent: '4',
    initialIndents:  '3',
    header: "",
    footer: "",
    defaultExtension: "php"
};

this.configForm = '<description>Variable for Selenium instance</description>' +
    '<textbox id="options_receiver" />' +
    '<checkbox id="options_showSelenese" label="Show Selenese"/>';

this.name = "PHP | Sausage | WebDriver";
//this.testcaseExtension = ".cs";
//this.suiteExtension = ".cs";
this.webdriver = true;

Equals.prototype.toString = function() {
    return this.e1.toString() + " == " + this.e2.toString();
};

Equals.prototype.assert = function() {
    return "$this->assertEquals(" + this.e1.toString() + ", " + this.e2.toString() + ");";
};

Equals.prototype.verify = function() {
    return verify(this.assert());
};

NotEquals.prototype.toString = function() {
    return this.e1.toString() + " != " + this.e2.toString();
};

NotEquals.prototype.assert = function() {
    return "$this->assertNotEquals(" + this.e1.toString() + ", " + this.e2.toString() + ");";
};

NotEquals.prototype.verify = function() {
    return verify(this.assert());
};

function joinExpression(expression) {
    return "String.Join(\",\", " + expression.toString() + ")";
}

function statement(expression) {
    return expression.toString() + ';';
}

function assignToVariable(type, variable, expression) {
    return capitalize(type) + " " + variable + " = " + expression.toString();
}

function ifCondition(expression, callback) {
    return "if (" + expression.toString() + ")\n{\n" + callback() + "}";
}

function assertTrue(expression) {
    return "$this->assertTrue(" + expression.toString() + ");";
}

function assertFalse(expression) {
    return "$this->assertFalse(" + expression.toString() + ");";
}

function verify(statement) {
    return "try\n" +
        "{\n" +
        indents(1) + statement + "\n" +
        "}\n" +
        "catch (AssertionException $e)\n" +
        "{\n" +
        indents(1) + "verificationErrors.Append(e.Message);\n" +
        "}";h
}

function verifyTrue(expression) {
    return verify(assertTrue(expression));
}

function verifyFalse(expression) {
    return verify(assertFalse(expression));
}

RegexpMatch.patternToString = function(pattern) {
    if (pattern != null) {
        //value = value.replace(/^\s+/, '');
        //value = value.replace(/\s+$/, '');
        pattern = pattern.replace(/\\/g, '\\\\');
        pattern = pattern.replace(/\"/g, '\\"');
        pattern = pattern.replace(/\r/g, '\\r');
        pattern = pattern.replace(/\n/g, '(\\n|\\r\\n)');
        return '"' + pattern + '"';
    } else {
        return '""';
    }
};

RegexpMatch.prototype.toString = function() {
    return "preg_match(" + RegexpMatch.patternToString(this.pattern) + "," + this.expression + ")";
};

function waitFor(expression) {
    return "$this->spinAssert(\"waitFor Failed\",(" + expression + "));";
}

function assertOrVerifyFailure(line, isAssert) {
    var message = '"expected failure"';
    var failStatement = isAssert ? "Assert.Fail(" + message + ");" :
        "verificationErrors.Append(" + message + ");";
    return "try\n" +
        "{\n" +
        line + "\n" +
        failStatement + "\n" +
        "}\n" +
        "catch (Exception) {}\n";
}

function pause(milliseconds) {
    return "sleep(" + parseInt(milliseconds, 10) + ");";
}

function echo(message) {
    return "echo(" + xlateArgument(message) + ");";
}

function formatComment(comment) {
    return comment.comment.replace(/.+/mg, function(str) {
        return "// " + str;
    });
}

function defaultExtension() {
    return this.options.defaultExtension;
}

WDAPI.Driver = function() {
    this.ref = options.receiver;
};

WDAPI.Driver.searchContext = function(locatorType, locator) {
    var locatorString = xlateArgument(locator);
    switch (locatorType) {
        case 'xpath':
            return '$this->using("xpath")->value(' + locatorString + ')';
        case 'css':
            return '$this->using("css selector")->value(' + locatorString + ')';
        case 'id':
            return '$this->using("id")->value(' + locatorString + ')';
        case 'link':
            return '$this->using("link text")->value(' + locatorString + ')';
        case 'name':
            return '$this->using("name")->value(' + locatorString + ')';
        case 'tag_name':
            return '$this->using("tag name")->value(' + locatorString + ')';
    }
    throw 'Error: unknown strategy [' + locatorType + '] for locator [' + locator + ']';
};

WDAPI.Driver.prototype.back = function() {
    return this.ref + "->back()";
};

WDAPI.Driver.prototype.close = function() {
    return this.ref + "->close()";
};

WDAPI.Driver.prototype.findElement = function(locatorType, locator) {
    return new WDAPI.Element(this.ref + "->element(" + WDAPI.Driver.searchContext(locatorType, locator) + ")");
};

WDAPI.Driver.prototype.findElements = function(locatorType, locator) {
    return new WDAPI.ElementList(this.ref + "->elements(" + WDAPI.Driver.searchContext(locatorType, locator) + ")");
};

WDAPI.Driver.prototype.getCurrentUrl = function() {
    return this.ref + "->url()";
};

WDAPI.Driver.prototype.get = function(url) {
    if (url.length > 1 && (url.substring(1,8) == "http://" || url.substring(1,9) == "https://")) { // url is quoted
        return this.ref + "->open(" + url + ")";
    } else {
        return this.ref + "->open(" + url + ")";
    }
};

WDAPI.Driver.prototype.getTitle = function() {
    return this.ref + "->title()";
};

WDAPI.Driver.prototype.getAlert = function() {
    return "CloseAlertAndGetItsText()";
};

WDAPI.Driver.prototype.chooseOkOnNextConfirmation = function() {
    return "acceptNextAlert = true";
};

WDAPI.Driver.prototype.chooseCancelOnNextConfirmation = function() {
    return "acceptNextAlert = false";
};

WDAPI.Driver.prototype.refresh = function() {
    return this.ref + "->refresh()";
};

WDAPI.Element = function(ref) {
    this.ref = ref;
};

WDAPI.Element.prototype.clear = function() {
    return this.ref + "->clear()";
};

WDAPI.Element.prototype.click = function() {
    return this.ref + "->click()";
};

WDAPI.Element.prototype.getAttribute = function(attributeName) {
    return this.ref + "->attribute(" + xlateArgument(attributeName) + ")";
};

WDAPI.Element.prototype.getText = function() {
    return this.ref + "->text()";
};

WDAPI.Element.prototype.isDisplayed = function() {
    return this.ref + "->displayed()";
};

WDAPI.Element.prototype.isSelected = function() {
    return this.ref + "->selected()";
};

WDAPI.Element.prototype.sendKeys = function(text) {
    return this.ref + "->value(" + xlateArgument(text) + ")";
};

WDAPI.Element.prototype.submit = function() {
    return this.ref + "->submit()";
};

WDAPI.Element.prototype.select = function(label) {
    return "new SelectElement(" + this.ref + ").SelectByText(" + xlateArgument(label) + ")";
};

WDAPI.ElementList = function(ref) {
    this.ref = ref;
};

WDAPI.ElementList.prototype.getItem = function(index) {
    return this.ref + "[" + index + "]";
};

WDAPI.ElementList.prototype.getSize = function() {
    return this.ref + ".length";
};

WDAPI.ElementList.prototype.isEmpty = function() {
    return this.ref + ".length == 0";
};

WDAPI.Utils = function() {
};

WDAPI.Utils.isElementPresent = function(locatorType, locator) {
    return "$this->element(" + WDAPI.Driver.searchContext(locatorType, locator) + ") instanceof PHPUnit_Extensions_Selenium2TestCase_Element";
};
