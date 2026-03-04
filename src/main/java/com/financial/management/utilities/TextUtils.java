package com.financial.management.utilities;

import java.text.Normalizer;

public class TextUtils {

    public static String normalize(String text){
        return Normalizer.normalize(text, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}", "")
                .toLowerCase()
                .trim();
    }

}
