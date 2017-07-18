/*
 * jQuery.validity v1.1.1
 * http://validity.thatscaptaintoyou.com/
 * http://code.google.com/p/validity/
 *
 * Copyright (c) 2010 Wyatt Allen
 * Dual licensed under the MIT and GPL licenses.
 *
 * Date: 2010-08-16 (Tuesday, 16 August 2010)
 * Revision: 134
 */
(function($) {

    // Default settings:
    ////////////////////////////////////////////////////////////////

    var
        defaults = {
            // The default output mode is label because it requires no dependencies:
            outputMode:"label",//label

            // The css class on the output
            cssClass:"error",

            // The this property is set to true, validity will scroll the browser viewport
            // so that the first error is visible when validation fails:
            scrollTo:false,

            // If this setting is true, modal errors will disappear when they are clicked on:
            modalErrorsClickable:true,

            // If a field name cannot be otherwise inferred, this will be used:
            defaultFieldName:"This field",

            // jQuery selector to filter down to validation-supported elements:
            elementSupport:":text, :password, textarea, select, :radio, :checkbox"
        };

    // Static functions and properties:
    ////////////////////////////////////////////////////////////////

    $.validity = {

        // Clone the defaults. They can be overridden with the setup function:
        settings:$.extend(defaults, {}),
        // Character classes can be used to determine the quantity
        // of a given type of character in a string:
        charClasses:{
            alphabetical:/\w/g,
            numeric:/\d/g,
            alphanumeric:/[A-Za-z0-9]/g,
            symbol:/[^A-Za-z0-9]/g
        },

        // Object to contain the output modes. The three built-in output modes are installed
        // later on in this script.
        outputs:{},

        // Override the default settings with user-specified ones.
        setup:function(options) {
            this.settings = $.extend(this.settings, options);
        },

        // Object to store information about ongoing validation.
        // When validation starts, this will be set to a report object.
        // When validators fail, they will inform this object.
        // When validation is completed, this object will contain the
        // information of whether it succeeded:
        report:null,

        // Determine whether validity is in the middle of validation:
        isValidating:function() {
            return !!this.report;
        },

        // Function to prepare validity to start validating:
        start:function() {
            // The output mode should be notified that validation is starting.
            // This usually means that the output mode will erase errors from the
            // document in whatever way the mode needs to:
            if (this.outputs[this.settings.outputMode] &&
                this.outputs[this.settings.outputMode].start) {
                this.outputs[this.settings.outputMode].start();
            }

            // Initialize the report object:
            this.report = { errors:0, valid:true };
        },

        // Function called when validation is over to examine the results and clean-up:
        end:function() {
            // Null coalescence: fix for Issue 5:
            var results = this.report || { errors: 0, valid: true };

            this.report = null;

            // Notify the current output mode that validation is over:
            if (this.outputs[this.settings.outputMode] &&
                this.outputs[this.settings.outputMode].end) {
                this.outputs[this.settings.outputMode].end(results);
            }

            return results;
        },

        // Remove validiation errors:
        clear:function() {
            this.start();
            this.end();
        }
    };

    // jQuery instance methods:
    ////////////////////////////////////////////////////////////////

    $.fn.extend({

        // The validity function is how validation can be bound to forms.
        // The user may pass in a validation function or, as a shortcut,
        // pass in a string of a CSS selector that grabs all the inputs to
        // require:
        validity:function(arg) {

            return this.each(

                function() {

                    // Only operate on forms:
                    if (this.tagName.toLowerCase() == "form") {
                        var f = null;

                        // If the user entered a string to select the inputs to require,
                        // then make the validation logic ad hoc:
                        if (typeof (arg) == "string") {
                            f = function() {
                                $(arg).require();
                            };
                        }

                        // If the user entered a validation function then just call
                        // that at the appropriate time:
                        else if ($.isFunction(arg)) {
                            f = arg;
                        }

                        if (arg) {
                            $(this).bind(
                                "submit",
                                function() {
                                    $.validity.start();
                                    f();
                                    return $.validity.end().valid;
                                }
                            );
                        }
                    }
                }
            );
        },

        // Validators:
        ////////////////////////////////////////////////

        // Common validators:
        ////////////////////////////////

        // Validate whether the field has a value.
        // http://validity.thatscaptaintoyou.com/Demos/index.htm#Require
        require:function(msg) {
            return validate(
                this,
                function(obj) {
                    var val = $(obj).val();

                    var res = val.length;

                    return res;
                },
                msg || $.validity.messages.require
            );
        },
        // Specialized validators:
        ////////////////////////////////

        // If expression is a function, it will be called on each matched element.
        // Otherwise, it is treated as a boolean, and the determines the validity
        // of elements in an aggregate fashion.
        // http://validity.thatscaptaintoyou.com/Demos/index.htm#Assert
        assert:function(expression, msg) {
            // If a reduced set is attached, use it.
            // Do not reduce to supported elements.
            var $reduction = this.reduction || this;

            if ($reduction.length) {

                // In the case that 'expression' is a function,
                // use it as a regimen on each matched element individually:
                if ($.isFunction(expression)) {
                    return validate(
                        this,
                        expression,
                        msg || $.validity.messages.generic
                    );
                }

                // Otherwise map it to a boolean and consider this as an aggregate validation:
                else if (!expression) {

                    raiseAggregateError(
                        $reduction,
                        msg || $.validity.messages.generic
                    );

                    // The set reduces to zero valid elements.
                    this.reduction = $([]);
                }
            }

            return this;
        }
    });

    // Private utilities:
    ////////////////////////////////////////////////////////////////

    // Do non-aggregate validation.
    // Subject each element in $obj to the regimen.
    // Raise the specified error on failures.
    // This function is the heart of validity:
    function validate($obj, regimen, message) {
        var
        // If a reduced set is attached, use it
        // Also, remove any unsupported elements.
            $reduction = ($obj.reduction || $obj).filter($.validity.settings.elementSupport),

        // Array to store only elements that pass the regimen.
            elements = [];

        // For each in the reduction.
        $reduction.each(
            function() {
                // If the element passes the regimen, include it in the reduction.
                if (regimen(this)) {
                    elements.push(this);
                }

                // Else give the element an error message.
                else {
                    raiseError(
                        this,
                        format(message, {
                            field:infer(this)
                        })
                    );
                }
            }
        );

        // Attach a (potentially) reduced set of only elements that passed.
        $obj.reduction = $(elements);

        // Return the full set with attached reduction.
        return $obj;
    }

    // Inform the report object that there was a failure.
    function addToReport() {
        if ($.validity.isValidating()) {
            $.validity.report.errors++;
            $.validity.report.valid = false;
        }
    }
    // Inform the report of a failure and display an error according to the
    // idiom of the current ouutput mode.
    function raiseError(obj, msg) {
        addToReport();

        if ($.validity.outputs[$.validity.settings.outputMode] &&
            $.validity.outputs[$.validity.settings.outputMode].raise) {
            $.validity.outputs[$.validity.settings.outputMode].raise($(obj), msg);
        }
    }

    // Inform the report of a failure and display an aggregate error according to the
    // idiom of the current output mode.
    function raiseAggregateError($obj, msg) {
        addToReport();

        if ($.validity.outputs[$.validity.settings.outputMode] &&
            $.validity.outputs[$.validity.settings.outputMode].raiseAggregate) {
            $.validity.outputs[$.validity.settings.outputMode].raiseAggregate($obj, msg);
        }
    }
    // Using the associative array supplied as the 'obj' argument,
    // replace tokens of the format #{<key>} in the 'str' argument with
    // that key's value.
    function format(str, obj) {
        for (var p in obj) {
            str = str.replace("#{" + p + "}", obj[p]);
        }
        return capitalize(str);
    }

    // Infer the field name of the passed DOM element.
    // If a title is specified, its value is returned.
    // Otherwise, attempt to parse a field name out of the id attribute.
    // If that doesn't work, return the default field name in the configuration.
    function infer(field) {
        var
            $f = $(field),
            ret = $.validity.settings.defaultFieldName;

        // Check for title.
        if ($f.attr("title").length) {
            ret = $f.attr("title");
        }

        // Check for UpperCamelCase.
        else if (/^([A-Z0-9][a-z]*)+$/.test(field.id)) {
            ret = field.id.replace(/([A-Z0-9])[a-z]*/g, " $&");
        }

        // Check for lowercase_separated_by_underscores
        else if (/^[a-z0-9_]*$/.test(field.id)) {
            var arr = field.id.split("_");

            for (var i = 0; i < arr.length; ++i) {
                arr[i] = capitalize(arr[i]);
            }

            ret = arr.join(" ");
        }

        return ret;
    }

    // Capitolize the first character of the string argument.
    function capitalize(sz) {
        return sz.substring ?
        sz.substring(0, 1).toUpperCase() + sz.substring(1, sz.length) :
            sz;
    }

})(jQuery);

// Output modes:
////////////////////////////////////////////////////////////////

// Each output mode gets its own closure,
// distinct from the validity closure.

// Install the label output.
(function($) {
    function getIdentifier($obj) {
        return $obj.attr('id').length ?
            $obj.attr('id') :
            $obj.attr('name');
    }

    $.validity.outputs.label = {
        start:function() {
            // Remove all the existing error labels.
            $("label." + $.validity.settings.cssClass).remove();
        },

        end:function(results) {
            // If not valid and scrollTo is enabled, scroll the page to the first error.
            if (!results.valid && $.validity.settings.scrollTo) {
                location.hash = $("label." + $.validity.settings.cssClass + ":eq(0)").attr('for');
            }
        },

        raise:function($obj, msg) {
            var
                labelSelector = "label." + $.validity.settings.cssClass + "[for='" + getIdentifier($obj) + "']";

            // If an error label already exists for the bad input just update its text:
            if ($(labelSelector).length) {
                $(labelSelector).text(msg);
            }

            // Otherwize create a new one and stick it after the input:
            else {
                $("<label/>")
                    .attr("for", getIdentifier($obj))
                    .addClass($.validity.settings.cssClass)
                    .text(msg)

                    // In the case that the element does not have an id
                    // then the for attribute in the label will not cause
                    // clicking the label to focus the element. This line
                    // will make that happen.
                    .click(function() {
                        if ($obj.length) {
                            $obj[0].select();
                        }
                    })

                    .insertAfter($obj).promise().done(function( arg1 ) {
                        arg1.addClass("error-animation");
                    });;
            }
        },

        raiseAggregate:function($obj, msg) {
            // Just raise the error on the last input.
            if ($obj.length) {
                this.raise($($obj.get($obj.length - 1)), msg);
            }
        }
    };
})(jQuery);

