function toggleAdditionalField() {
            var option = document.getElementById("transaction-option").value;
            var additionalField = document.getElementById("additional-field");

            if (option === "Other") {
                additionalField.style.display = "block";
            } else {
                additionalField.style.display = "none";
            }
        }