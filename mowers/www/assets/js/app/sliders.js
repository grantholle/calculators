define(["jquery","slider"],function(e){var i=function(){var i=(e("div.perc-slider"),e("div.has-slider"),e("div#competitor-mower-slider")),t=e("div#propane-mower-slider"),r=e("div#price-per-gallon"),o=e("input#competitor-mower-price"),n=e("input#propane-mower-price"),a=e("input#comp-fuel-price"),p=e("input#propane-fuel-price"),l=e("div.toggle-group"),f=e("body"),d={},u=function(){m(),s()},s=function(){f.on("swapCompetitor",c),f.on("initializeSlider",m),f.trigger("slidersInitialized")},c=function(e){fuelSlider.noUiSlider({start:[1.5,parseFloat(l.find("button.active").data("fuel-default"))]},!0)},m=function(){var d=e.Link({target:function(e,i,t){f.trigger("moveTooltip",[o.parent(),e,i[0].parentNode.offsetLeft])}}),u=e.Link({target:function(e,i,t){f.trigger("moveTooltip",[n.parent(),e,i[0].parentNode.offsetLeft])}}),s=e.Link({target:function(e,i,t){f.trigger("moveTooltip",[p.parent(),e,i[0].parentNode.offsetLeft,r])}}),c=e.Link({target:function(e,i,t){f.trigger("moveTooltip",[a.parent(),e,i[0].parentNode.offsetLeft,r])}});competitorSlider=i.noUiSlider({start:10500,connect:"lower",behaviour:"snap",range:{min:0,max:25e3},step:100,serialization:{format:{thousand:",",prefix:"$",decimals:0},lower:[d]}}),propaneSlider=t.noUiSlider({start:10500,connect:"lower",behaviour:"snap",range:{min:0,max:25e3},step:100,serialization:{format:{thousand:",",prefix:"$",decimals:0},lower:[u]}}),fuelSlider=r.noUiSlider({start:[1.5,parseFloat(l.find("button.active").data("fuel-default"))],behaviour:"snap",range:{min:.5,max:6},step:.01,serialization:{format:{prefix:"$"},lower:[s],upper:[c]}})};return d.init=u,d}();return i});